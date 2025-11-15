from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from ..permissions import IsAdmin
from ..serializers import UserSerializer

User = get_user_model()


class UserViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filterset_fields = ("role", "is_active")
    search_fields = ("username", "email", "first_name", "last_name")
    ordering_fields = ("first_name", "last_name", "email")
    ordering = ("first_name", "last_name", "email")

    def get_queryset(self):
        return (
            User.objects.select_related("client")
            .filter(is_active=True)
            .order_by("first_name", "last_name", "email")
        )


