from __future__ import annotations

from django.db import transaction
from django.db.models import Prefetch
from django.utils import timezone
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .. import filters, models, permissions
from ..serializers import (
    TimeEntrySerializer,
    TimeEntryTimerSerializer,
    TimeEntryTimerStopSerializer,
)


class TimeEntryViewSet(viewsets.ModelViewSet):
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]
    filterset_class = filters.TimeEntryFilter
    search_fields = ("task", "notes")
    ordering_fields = ("date", "created_at", "duration_minutes")

    def get_queryset(self):
        queryset = (
            models.TimeEntry.objects.select_related("project", "project__client", "user")
            .prefetch_related(
                "project__assignments",
                Prefetch(
                    "project__hourly_rates",
                    queryset=models.HourlyRate.objects.order_by("-effective_from"),
                ),
                Prefetch(
                    "project__client__hourly_rates",
                    queryset=models.HourlyRate.objects.order_by("-effective_from"),
                ),
            )
            .all()
        )
        user = self.request.user
        if user.is_admin:
            filtered = queryset
        else:
            filtered = queryset.filter(project__client=user.client)

        project_filter = self.request.query_params.get("project")
        return filtered

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        return [IsAuthenticated(), permissions.IsAdmin()]


class TimeEntryTimerViewSet(viewsets.ModelViewSet):
    serializer_class = TimeEntryTimerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = (
            models.TimeEntryTimer.objects.select_related("project", "project__client", "user")
            .order_by("-created_at")
        )
        user = self.request.user
        if user.is_admin:
            return queryset
        return queryset.filter(user=user)

    def perform_create(self, serializer):
        request = self.request
        user = request.user
        project = serializer.validated_data["project"]

        if (
            not user.is_admin
            and not permissions.user_is_assigned_to_project(user, project)
        ):
            raise serializers.ValidationError(
                {"project": "You are not assigned to this project."}
            )

        if models.TimeEntryTimer.objects.filter(
            user=user,
            status=models.TimeEntryTimer.Status.RUNNING,
        ).exists():
            raise serializers.ValidationError(
                {"non_field_errors": "Já tens um temporizador em curso. Faz stop antes de iniciar outro."}
            )

        serializer.save(
            user=user,
            last_resumed_at=timezone.now(),
            status=models.TimeEntryTimer.Status.RUNNING,
        )

    @action(detail=True, methods=["post"])
    def pause(self, request, pk=None):
        timer = self.get_object()
        if timer.status != models.TimeEntryTimer.Status.RUNNING:
            return Response(
                {"detail": "O temporizador não está em execução."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        timer.pause()
        serializer = self.get_serializer(timer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def resume(self, request, pk=None):
        timer = self.get_object()
        if timer.status != models.TimeEntryTimer.Status.PAUSED:
            return Response(
                {"detail": "O temporizador não está em pausa."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        timer.resume()
        serializer = self.get_serializer(timer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def stop(self, request, pk=None):
        timer = self.get_object()
        stop_serializer = TimeEntryTimerStopSerializer(data=request.data)
        stop_serializer.is_valid(raise_exception=True)

        summary = stop_serializer.validated_data["summary"].strip()
        task = stop_serializer.validated_data.get("task", "").strip() or "Trabalho registado"
        billable = stop_serializer.validated_data.get("billable", True)

        with transaction.atomic():
            time_entry = timer.complete(
                summary=summary,
                task=task,
                billable=billable,
            )

        response_serializer = TimeEntrySerializer(time_entry, context={"request": request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

