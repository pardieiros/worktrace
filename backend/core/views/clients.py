from __future__ import annotations

from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .. import models, permissions
from ..serializers import ClientSerializer


class ClientViewSet(viewsets.ModelViewSet):
    queryset = models.Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated, permissions.IsAdmin]
    filterset_fields = ("is_active",)
    search_fields = ("name", "email")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = dict(serializer.data)
        if getattr(serializer, "initial_password", None):
            data["initial_password"] = serializer.initial_password
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

