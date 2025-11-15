from __future__ import annotations

from rest_framework import serializers

from .. import models


class SystemSettingsSerializer(serializers.ModelSerializer):
    smtp_password = serializers.CharField(
        write_only=True, required=False, allow_blank=True, trim_whitespace=False
    )
    smtp_password_set = serializers.SerializerMethodField(read_only=True)
    branding_logo = serializers.ImageField(required=False, allow_null=True)
    branding_logo_url = serializers.SerializerMethodField()
    remove_branding_logo = serializers.BooleanField(
        write_only=True, required=False, default=False
    )

    class Meta:
        model = models.SystemSettings
        fields = (
            "company_name",
            "company_legal_name",
            "company_email",
            "company_phone",
            "company_website",
            "company_vat",
            "company_address",
            "support_email",
            "billing_email",
            "default_sender_name",
            "default_sender_email",
            "reply_to_email",
            "branding_logo",
            "branding_logo_url",
            "smtp_host",
            "smtp_port",
            "smtp_username",
            "smtp_password",
            "smtp_use_tls",
            "smtp_use_ssl",
            "smtp_password_set",
            "created_at",
            "updated_at",
            "remove_branding_logo",
        )
        read_only_fields = (
            "created_at",
            "updated_at",
            "smtp_password_set",
            "branding_logo_url",
        )

    def get_smtp_password_set(self, obj: models.SystemSettings) -> bool:
        return bool(obj.smtp_password)

    def get_branding_logo_url(self, obj: models.SystemSettings) -> str | None:
        if obj.branding_logo and hasattr(obj.branding_logo, "url"):
            return obj.branding_logo.url
        return None

    def validate(self, attrs):
        instance = getattr(self, "instance", None)
        use_tls = attrs.get("smtp_use_tls", getattr(instance, "smtp_use_tls", True))
        use_ssl = attrs.get("smtp_use_ssl", getattr(instance, "smtp_use_ssl", False))
        if use_tls and use_ssl:
            raise serializers.ValidationError(
                {"smtp_use_ssl": "Enable either TLS or SSL, not both."}
            )
        return attrs

    def update(self, instance: models.SystemSettings, validated_data):
        smtp_password = validated_data.pop("smtp_password", None)
        remove_logo = validated_data.pop("remove_branding_logo", False)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        if smtp_password is not None:
            instance.smtp_password = smtp_password
        if remove_logo:
            if instance.branding_logo:
                instance.branding_logo.delete(save=False)
            instance.branding_logo = None
        instance.save()
        return instance


