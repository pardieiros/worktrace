from __future__ import annotations

import csv
import io
from collections import defaultdict
from dataclasses import dataclass
from decimal import Decimal
from typing import Iterable, List, Tuple

from django.contrib.auth import get_user_model
from django.db.models import Prefetch, Q
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML

from .. import models

User = get_user_model()


@dataclass
class ReportFilters:
    client_id: int | None = None
    project_id: int | None = None
    user_id: int | None = None
    date_from: str | None = None
    date_to: str | None = None
    billable: bool | None = None


def build_queryset(user: User, filters: ReportFilters):
    queryset = models.TimeEntry.objects.select_related("project", "project__client", "user").prefetch_related(
        Prefetch(
            "project__hourly_rates",
            queryset=models.HourlyRate.objects.order_by("-effective_from"),
        ),
        Prefetch(
            "project__client__hourly_rates",
            queryset=models.HourlyRate.objects.order_by("-effective_from"),
        ),
    )

    if user.is_client:
        queryset = queryset.filter(
            Q(project__assignments__user=user, project__assignments__is_active=True)
            | Q(project__client=user.client)
        )

    if filters.client_id:
        queryset = queryset.filter(project__client_id=filters.client_id)
    if filters.project_id:
        queryset = queryset.filter(project_id=filters.project_id)
    if filters.user_id:
        queryset = queryset.filter(user_id=filters.user_id)
    if filters.date_from:
        queryset = queryset.filter(date__gte=filters.date_from)
    if filters.date_to:
        queryset = queryset.filter(date__lte=filters.date_to)
    if filters.billable is not None:
        queryset = queryset.filter(billable=filters.billable)

    return queryset.distinct()


def resolve_rate(entry: models.TimeEntry) -> Decimal | None:
    date = entry.date
    project_rates = entry.project.hourly_rates.all()
    client_rates = entry.project.client.hourly_rates.all()

    for rate in project_rates:
        if rate.effective_from <= date and (not rate.effective_to or rate.effective_to >= date):
            return rate.amount_decimal

    for rate in client_rates:
        if rate.effective_from <= date and (not rate.effective_to or rate.effective_to >= date):
            return rate.amount_decimal
    return None


def summarize(user: User, filters: ReportFilters) -> List[dict]:
    queryset = build_queryset(user, filters)
    summary_map: dict[Tuple[int, int], dict] = {}

    for entry in queryset:
        key = (entry.project_id, entry.user_id)
        if key not in summary_map:
            summary_map[key] = {
                "client": entry.project.client.name,
                "project": entry.project.name,
                "user": entry.user.get_full_name() or entry.user.email,
                "total_minutes": 0,
                "billable_minutes": 0,
                "non_billable_minutes": 0,
                "total_amount": Decimal("0.00"),
            }

        payload = summary_map[key]
        payload["total_minutes"] += entry.duration_minutes
        if entry.billable:
            payload["billable_minutes"] += entry.duration_minutes
        else:
            payload["non_billable_minutes"] += entry.duration_minutes

        rate = resolve_rate(entry)
        if rate:
            hours = Decimal(entry.duration_minutes) / Decimal(60)
            payload["total_amount"] += (hours * rate).quantize(Decimal("0.01"))

    return list(summary_map.values())


def export_csv(rows: Iterable[dict]) -> HttpResponse:
    buffer = io.StringIO()
    writer = csv.DictWriter(
        buffer,
        fieldnames=[
            "client",
            "project",
            "user",
            "total_minutes",
            "billable_minutes",
            "non_billable_minutes",
            "total_amount",
        ],
    )
    writer.writeheader()
    for row in rows:
        writer.writerow(row)

    response = HttpResponse(buffer.getvalue(), content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="worktrace-report.csv"'
    return response


def export_pdf(rows: Iterable[dict]) -> HttpResponse:
    html_content = render_to_string(
        "reports/summary.html",
        {
            "rows": rows,
            "branding": {
                "title": "Worktrace Report",
            },
        },
    )
    pdf_file = HTML(string=html_content).write_pdf()
    response = HttpResponse(pdf_file, content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="worktrace-report.pdf"'
    return response

