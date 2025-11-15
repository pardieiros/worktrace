from __future__ import annotations

from django.db.models import Q
from rest_framework import status as drf_status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .. import models, permissions
from ..serializers import (
    ProjectAssignmentSerializer,
    ProjectSerializer,
  ProjectStatusUpdateSerializer,
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
        client_id = getattr(user, "client_id", None)
        if not client_id:
            return queryset.none()
        filtered_queryset = queryset.filter(client_id=client_id).distinct()

        return filtered_queryset

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        return [IsAuthenticated(), permissions.IsAdmin()]

    @action(detail=True, methods=["post"], url_path="status")
    def status(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        project.status = serializer.validated_data["status"]
        project.save(update_fields=["status", "updated_at"])

        response_serializer = self.get_serializer(project)
        return Response(response_serializer.data, status=drf_status.HTTP_200_OK)


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

