from __future__ import annotations

from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthView(APIView):
    authentication_classes: list = []
    permission_classes: list = []

    def get(self, request):
        token = settings.HEALTH_CHECK_TOKEN
        if token and request.headers.get("X-Health-Token") != token:
            return Response({"status": "forbidden"}, status=403)
        return Response({"status": "ok"})

