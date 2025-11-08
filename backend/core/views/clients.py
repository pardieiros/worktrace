from __future__ import annotations

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .. import models, permissions
from ..serializers import ClientSerializer


class ClientViewSet(viewsets.ModelViewSet):
    queryset = models.Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated, permissions.IsAdmin]
    filterset_fields = ("is_active",)
    search_fields = ("name", "email")

