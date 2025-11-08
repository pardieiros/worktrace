from __future__ import annotations

from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from .. import models, permissions


class TimeEntrySerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source="project.name", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = models.TimeEntry
        fields = (
            "id",
            "project",
            "project_name",
            "user",
            "user_email",
            "date",
            "start",
            "end",
            "duration_minutes",
            "task",
            "notes",
            "billable",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "project_name", "user_email")

    def validate(self, attrs):
        request = self.context["request"]
        project = attrs.get("project") or getattr(self.instance, "project", None)
        user = attrs.get("user") or getattr(self.instance, "user", None)

        if request.user.is_admin:
            if user and project and not models.ProjectAssignment.objects.filter(
                project=project,
                user=user,
                is_active=True,
            ).exists():
                raise serializers.ValidationError(
                    {"user": _("User must be assigned to the project.")}
                )
            return attrs

        # Client-side users can only log their own entries and must belong to the assignment.
        attrs["user"] = request.user
        user = request.user
        if project and not permissions.user_is_assigned_to_project(user, project):
            raise serializers.ValidationError(
                {"project": _("You are not assigned to this project.")}
            )
        return attrs

