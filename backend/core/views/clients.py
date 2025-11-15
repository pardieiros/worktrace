from __future__ import annotations

from collections import defaultdict
from decimal import Decimal

from django.db.models import Case, DecimalField, F, Prefetch, Sum, Value, When
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from .. import models, permissions
from ..services import reporting
from ..serializers import (
    ClientAccountEntrySerializer,
    ClientAccountSummarySerializer,
    ClientPaymentCreateSerializer,
    ClientSerializer,
)


class ClientViewSet(viewsets.ModelViewSet):
    queryset = models.Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated, permissions.AdminWritePermission]
    filterset_fields = ("is_active",)
    search_fields = ("name", "email")

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        if getattr(user, "is_admin", False):
            return queryset
        client_id = getattr(user, "client_id", None)
        if client_id:
            return queryset.filter(pk=client_id)
        return queryset.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = dict(serializer.data)
        if getattr(serializer, "initial_password", None):
            data["initial_password"] = serializer.initial_password
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=["get"], url_path="account")
    def account(self, request, pk=None):
        client = self.get_object()
        entries_qs = client.account_entries.order_by("-occurred_at", "-created_at")

        pack_projects_qs = client.projects.filter(
            billing_type=models.Project.BillingType.PACK,
            pack_total_value__isnull=False,
        ).exclude(pack_total_value=0)

        pack_projects_payload: list[dict] = []
        pack_total_due = Decimal("0")

        for project in pack_projects_qs:
            pack_value = project.pack_total_value or Decimal("0")
            if pack_value <= 0:
                continue
            pack_total_due += pack_value
            pack_projects_payload.append(
                {
                    "id": project.id,
                    "name": project.name,
                    "pack_hours": (
                        format(project.pack_hours, "f") if project.pack_hours is not None else None
                    ),
                    "pack_total_value": format(pack_value, "f"),
                    "currency": project.currency,
                    "status": project.status,
                }
            )

        hourly_entries_qs = (
            models.TimeEntry.objects.filter(
                project__client=client,
                project__billing_type=models.Project.BillingType.HOURLY,
                billable=True,
            )
            .select_related("project", "project__client")
            .prefetch_related(
                Prefetch(
                    "project__hourly_rates",
                    queryset=models.HourlyRate.objects.order_by("-effective_from"),
                ),
                Prefetch(
                    "project__client__hourly_rates",
                    queryset=models.HourlyRate.objects.order_by("-effective_from"),
                ),
            )
        )

        hourly_total_due = Decimal("0")
        hourly_projects_map: dict[int, dict] = defaultdict(
            lambda: {
                "id": None,
                "name": "",
                "billable_minutes": 0,
                "amount": Decimal("0"),
                "currency": "",
            }
        )

        for entry in hourly_entries_qs:
            rate = reporting.resolve_rate(entry)
            if rate is None:
                rate = entry.project.hourly_rate
            if rate is None:
                continue
            hours = Decimal(entry.duration_minutes) / Decimal(60)
            amount = (hours * rate).quantize(Decimal("0.01"))
            hourly_total_due += amount

            payload = hourly_projects_map[entry.project_id]
            payload["id"] = entry.project_id
            payload["name"] = entry.project.name
            payload["billable_minutes"] += entry.duration_minutes
            payload["amount"] += amount
            payload["currency"] = entry.project.currency

        hourly_projects_payload = []
        for data in hourly_projects_map.values():
            billable_hours = Decimal(data["billable_minutes"]) / Decimal(60)
            amount_decimal = data["amount"].quantize(Decimal("0.01"))
            billable_hours_decimal = billable_hours.quantize(Decimal("0.01"))
            hourly_projects_payload.append(
                {
                    "id": data["id"],
                    "name": data["name"],
                    "billable_minutes": data["billable_minutes"],
                    "billable_hours": format(billable_hours_decimal, "f"),
                    "amount": format(amount_decimal, "f"),
                    "currency": data["currency"],
                }
            )

        pack_total_due = pack_total_due.quantize(Decimal("0.01")) if pack_total_due else Decimal("0.00")
        hourly_total_due = hourly_total_due.quantize(Decimal("0.01")) if hourly_total_due else Decimal("0.00")

        aggregates = entries_qs.aggregate(
            total_charged=Sum(
                Case(
                    When(
                        entry_type=models.ClientAccountEntry.EntryType.CHARGE,
                        then=F("amount"),
                    ),
                    default=Value(0),
                    output_field=DecimalField(max_digits=12, decimal_places=2),
                )
            ),
            total_paid=Sum(
                Case(
                    When(
                        entry_type=models.ClientAccountEntry.EntryType.PAYMENT,
                        then=F("amount"),
                    ),
                    default=Value(0),
                    output_field=DecimalField(max_digits=12, decimal_places=2),
                )
            ),
        )

        total_charged = aggregates["total_charged"] or Decimal("0")
        total_paid = aggregates["total_paid"] or Decimal("0")
        total_charged += pack_total_due + hourly_total_due
        balance = total_charged - total_paid
        currency = (
            entries_qs.values_list("currency", flat=True).first()
            or pack_projects_qs.values_list("currency", flat=True).first()
            or hourly_entries_qs.values_list("project__currency", flat=True).first()
            or "EUR"
        )

        summary = {
            "client": client,
            "balance": balance,
            "total_charged": total_charged,
            "total_paid": total_paid,
            "currency": currency,
            "entries": list(entries_qs),
            "pack_total_due": pack_total_due,
            "pack_projects": pack_projects_payload,
            "hourly_total_due": hourly_total_due,
            "hourly_projects": hourly_projects_payload,
        }

        serializer = ClientAccountSummarySerializer(
            summary,
            context=self.get_serializer_context(),
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="payments")
    def create_payment(self, request, pk=None):
        client = self.get_object()
        serializer = ClientPaymentCreateSerializer(
            data=request.data,
            context={
                **self.get_serializer_context(),
                "client": client,
            },
        )
        serializer.is_valid(raise_exception=True)
        entry = serializer.save()
        entry_serializer = ClientAccountEntrySerializer(
            entry,
            context=self.get_serializer_context(),
        )
        return Response(entry_serializer.data, status=status.HTTP_201_CREATED)

