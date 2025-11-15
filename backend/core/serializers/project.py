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
            "billing_type",
            "pack_hours",
            "pack_total_value",
            "hourly_rate",
            "currency",
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
            "created_by",
        )

    def get_total_logged_hours(self, obj: models.Project) -> float:
        return round(obj.total_logged_minutes / 60, 2)

    def validate(self, attrs):
        instance = getattr(self, "instance", None)
        billing_type = attrs.get("billing_type")
        if billing_type is None and instance is not None:
            billing_type = instance.billing_type
        currency = attrs.get("currency")
        if currency is None and instance is not None:
            currency = instance.currency

        pack_hours = attrs.get("pack_hours", getattr(instance, "pack_hours", None))
        pack_total_value = attrs.get(
            "pack_total_value", getattr(instance, "pack_total_value", None)
        )
        hourly_rate = attrs.get("hourly_rate", getattr(instance, "hourly_rate", None))

        errors = {}

        if billing_type == models.Project.BillingType.PACK:
            if pack_hours is None:
                errors["pack_hours"] = "Pack hours are required for pack-based projects."
            elif pack_hours <= 0:
                errors["pack_hours"] = "Pack hours must be greater than zero."

            if pack_total_value is None:
                errors["pack_total_value"] = "Pack total value is required for pack-based projects."
            elif pack_total_value <= 0:
                errors["pack_total_value"] = "Pack total value must be greater than zero."

            if hourly_rate is None:
                errors["hourly_rate"] = "Hourly rate is required for overtime in pack-based projects."
            elif hourly_rate <= 0:
                errors["hourly_rate"] = "Hourly rate must be greater than zero."
        else:
            if billing_type != models.Project.BillingType.HOURLY:
                errors["billing_type"] = "Invalid billing type."
            if pack_hours not in (None, 0):
                errors["pack_hours"] = "Pack hours should not be set for hourly projects."
            if pack_total_value not in (None, 0):
                errors["pack_total_value"] = "Pack total value should not be set for hourly projects."
            if hourly_rate is None:
                errors["hourly_rate"] = "Hourly rate is required."
            elif hourly_rate <= 0:
                errors["hourly_rate"] = "Hourly rate must be greater than zero."

        if currency is None:
            errors["currency"] = "Currency is required."

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["created_by"] = request.user
        return super().create(validated_data)


class ProjectStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=models.Project.Status.choices)

