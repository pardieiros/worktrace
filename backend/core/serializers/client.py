from __future__ import annotations

from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils.crypto import get_random_string
from rest_framework import serializers

User = get_user_model()

from .. import models


class ClientSerializer(serializers.ModelSerializer):
    initial_password = serializers.CharField(read_only=True)

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
            "initial_password",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "branding_logo_url",
            "initial_password",
        )

    def get_branding_logo_url(self, obj: models.Client) -> str | None:
        if obj.branding_logo and hasattr(obj.branding_logo, "url"):
            return obj.branding_logo.url
        return None

    def to_representation(self, instance: models.Client) -> dict:
        data = super().to_representation(instance)
        if getattr(self, "initial_password", None):
            data["initial_password"] = self.initial_password
        else:
            data.pop("initial_password", None)
        return data

    def validate_email(self, value: str) -> str:
        normalized = value.lower()
        user_qs = User.objects.filter(email__iexact=normalized)
        if self.instance:
            user_qs = user_qs.exclude(client=self.instance)
        if user_qs.exists():
            raise serializers.ValidationError("Já existe um utilizador com este email.")
        client_qs = models.Client.objects.filter(email__iexact=normalized)
        if self.instance:
            client_qs = client_qs.exclude(pk=self.instance.pk)
        if client_qs.exists():
            raise serializers.ValidationError("Já existe um cliente com este email.")
        return normalized

    @transaction.atomic
    def create(self, validated_data: dict) -> models.Client:
        email = validated_data["email"]
        password = get_random_string(length=12)
        client = super().create(validated_data)

        username = email
        if User.objects.filter(username=username).exists():
            username = f"{username.split('@')[0]}-{client.pk}"

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=User.Roles.CLIENT,
            client=client,
        )
        if user.is_staff:
            user.is_staff = False
            user.save(update_fields=["is_staff"])

        self.initial_password = password
        return client

    @transaction.atomic
    def update(self, instance: models.Client, validated_data: dict) -> models.Client:
        old_email = instance.email.lower()
        client = super().update(instance, validated_data)
        new_email = client.email.lower()
        if old_email != new_email:
            users = User.objects.filter(client=client, role=User.Roles.CLIENT)
            for user in users:
                user.email = new_email
                if not User.objects.exclude(pk=user.pk).filter(username=new_email).exists():
                    user.username = new_email
                user.save(update_fields=["email", "username"])
        return client

