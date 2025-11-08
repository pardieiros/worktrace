from __future__ import annotations

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .. import models, permissions
from ..serializers import (
    ProjectAssignmentSerializer,
    ProjectSerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ("client", "status", "visibility")
    search_fields = ("name", "description")
    ordering_fields = ("name", "created_at", "status")

    def get_queryset(self):
        queryset = (
            models.Project.objects.select_related("client", "created_by")
            .prefetch_related("assignments")
            .all()
        )
        user = self.request.user
        if user.is_admin:
            return queryset
        return (
            queryset.filter(client=user.client, visibility=models.Project.Visibility.CLIENT)
            .distinct()
        )

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        return [IsAuthenticated(), permissions.IsAdmin()]


class ProjectAssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectAssignmentSerializer
    queryset = (
        models.ProjectAssignment.objects.select_related("project", "user")
        .prefetch_related("project__client")
        .all()
    )
    permission_classes = [IsAuthenticated, permissions.IsAdmin]
    filterset_fields = ("project", "user", "role", "is_active")
    search_fields = ("project__name", "user__username", "user__email")

