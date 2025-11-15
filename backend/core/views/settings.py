from __future__ import annotations

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .. import models, permissions, serializers


class SystemSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.SystemSettingsSerializer
    permission_classes = [IsAuthenticated, permissions.IsAdmin]

    def get_object(self):
        return models.SystemSettings.load()


