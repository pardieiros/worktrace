from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .. import models

User = get_user_model()


class ProjectAssignmentSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_name = serializers.CharField(
        source="user.get_full_name", read_only=True
    )
    project_name = serializers.CharField(source="project.name", read_only=True)

    class Meta:
        model = models.ProjectAssignment
        fields = (
            "id",
            "project",
            "project_name",
            "user",
            "user_email",
            "user_name",
            "role",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "user_email", "user_name")

    def validate(self, attrs):
        project = attrs.get("project") or getattr(self.instance, "project", None)
        user = attrs.get("user") or getattr(self.instance, "user", None)
        if project and user and not user.is_admin:
            if user.client_id != project.client_id:
                raise serializers.ValidationError(
                    "Only admins or users associated with the project's client may be assigned."
                )
        return attrs


class HourlyRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.HourlyRate
        fields = (
            "id",
            "client",
            "project",
            "amount_decimal",
            "currency",
            "effective_from",
            "effective_to",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class ProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source="client.name", read_only=True)
    created_by_name = serializers.CharField(source="created_by.get_full_name", read_only=True)
    total_logged_hours = serializers.SerializerMethodField()

    class Meta:
        model = models.Project
        fields = (
            "id",
            "name",
            "client",
            "client_name",
            "description",
            "status",
            "visibility",
            "created_by",
            "created_by_name",
            "created_at",
            "updated_at",
            "total_logged_minutes",
            "total_logged_hours",
            "last_logged_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "total_logged_minutes",
            "total_logged_hours",
            "last_logged_at",
            "created_by_name",
            "client_name",
        )

    def get_total_logged_hours(self, obj: models.Project) -> float:
        return round(obj.total_logged_minutes / 60, 2)

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["created_by"] = request.user
        return super().create(validated_data)

