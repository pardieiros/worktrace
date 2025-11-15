from __future__ import annotations

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0003_timeentrytimer"),
    ]

    operations = [
        migrations.CreateModel(
            name="SystemSettings",
            fields=[
                (
                    "id",
                    models.PositiveSmallIntegerField(
                        default=1, editable=False, primary_key=True, serialize=False
                    ),
                ),
                ("company_name", models.CharField(blank=True, max_length=255)),
                ("company_legal_name", models.CharField(blank=True, max_length=255)),
                ("company_email", models.EmailField(blank=True, max_length=254)),
                ("company_phone", models.CharField(blank=True, max_length=64)),
                ("company_website", models.URLField(blank=True)),
                ("company_vat", models.CharField(blank=True, max_length=64)),
                ("company_address", models.TextField(blank=True)),
                ("support_email", models.EmailField(blank=True, max_length=254)),
                ("billing_email", models.EmailField(blank=True, max_length=254)),
                ("default_sender_name", models.CharField(blank=True, max_length=255)),
                ("default_sender_email", models.EmailField(blank=True, max_length=254)),
                ("reply_to_email", models.EmailField(blank=True, max_length=254)),
                ("smtp_host", models.CharField(blank=True, max_length=255)),
                ("smtp_port", models.PositiveIntegerField(default=587)),
                ("smtp_username", models.CharField(blank=True, max_length=255)),
                ("smtp_password", models.TextField(blank=True)),
                ("smtp_use_tls", models.BooleanField(default=True)),
                ("smtp_use_ssl", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "System settings",
                "verbose_name_plural": "System settings",
            },
        ),
    ]


