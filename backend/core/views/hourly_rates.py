from __future__ import annotations

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .. import models, permissions
from ..serializers import HourlyRateSerializer


class HourlyRateViewSet(viewsets.ModelViewSet):
    queryset = models.HourlyRate.objects.select_related("client", "project")
    serializer_class = HourlyRateSerializer
    permission_classes = [IsAuthenticated, permissions.IsAdmin]
    filterset_fields = ("client", "project", "currency")

