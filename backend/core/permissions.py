from __future__ import annotations

from typing import Any

from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdmin(BasePermission):
    """Allows access only to admin role users."""

    def has_permission(self, request, view) -> bool:
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "is_admin", False))


class IsClient(BasePermission):
    """Allows access only to client role users."""

    def has_permission(self, request, view) -> bool:
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "is_client", False))


class AdminWritePermission(BasePermission):
    """
    Allow read to authenticated users but restrict write operations to admins.
    """

    def has_permission(self, request, view) -> bool:
        if request.method in SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        return IsAdmin().has_permission(request, view)


def user_is_assigned_to_project(user, project) -> bool:
    if user.is_admin:
        return True
    return project.assignments.filter(user=user, is_active=True).exists()


