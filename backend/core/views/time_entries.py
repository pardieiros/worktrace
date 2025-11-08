from __future__ import annotations

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .. import filters, models, permissions
from ..serializers import TimeEntrySerializer


class TimeEntryViewSet(viewsets.ModelViewSet):
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]
    filterset_class = filters.TimeEntryFilter
    search_fields = ("task", "notes")
    ordering_fields = ("date", "created_at", "duration_minutes")

    def get_queryset(self):
        queryset = (
            models.TimeEntry.objects.select_related("project", "project__client", "user")
            .prefetch_related("project__assignments")
            .all()
        )
        user = self.request.user
        if user.is_admin:
            return queryset
        return queryset.filter(
            project__client=user.client,
            project__visibility=models.Project.Visibility.CLIENT,
        ).filter(project__assignments__user=user, project__assignments__is_active=True)

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        return [IsAuthenticated(), permissions.IsAdmin()]

