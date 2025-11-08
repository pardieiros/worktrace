from __future__ import annotations

from rest_framework import serializers

from .. import models


class ClientSerializer(serializers.ModelSerializer):
    branding_logo_url = serializers.SerializerMethodField()

    class Meta:
        model = models.Client
        fields = (
            "id",
            "name",
            "email",
            "vat",
            "notes",
            "is_active",
            "branding_logo",
            "branding_logo_url",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "branding_logo_url")

    def get_branding_logo_url(self, obj: models.Client) -> str | None:
        if obj.branding_logo and hasattr(obj.branding_logo, "url"):
            return obj.branding_logo.url
        return None

