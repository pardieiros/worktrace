from __future__ import annotations

from django.conf import settings
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("core", "0005_systemsettings_branding_logo"),
    ]

    operations = [
        migrations.CreateModel(
            name="ClientAccountEntry",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("entry_type", models.CharField(choices=[("charge", "Charge"), ("payment", "Payment")], help_text="Defines whether the entry is a charge or a payment.", max_length=20)),
                ("amount", models.DecimalField(decimal_places=2, help_text="Monetary amount for this entry.", max_digits=12)),
                ("currency", models.CharField(default="EUR", max_length=8)),
                ("occurred_at", models.DateField(default=django.utils.timezone.now)),
                ("reference", models.CharField(blank=True, help_text="Optional external reference such as invoice or payment code.", max_length=255)),
                ("description", models.CharField(blank=True, help_text="Short description displayed to administrators and clients.", max_length=255)),
                ("payment_method", models.CharField(blank=True, help_text="For payments, specifies how the amount was received.", max_length=64)),
                ("notes", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("client", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="account_entries", to="core.client")),
                ("recorded_by", models.ForeignKey(blank=True, null=True, on_delete=models.deletion.SET_NULL, related_name="client_account_entries", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "verbose_name": "Client account entry",
                "verbose_name_plural": "Client account entries",
                "ordering": ("-occurred_at", "-created_at"),
            },
        ),
        migrations.AddIndex(
            model_name="clientaccountentry",
            index=models.Index(fields=["client", "entry_type"], name="core_client_client__f4ff80_idx"),
        ),
        migrations.AddIndex(
            model_name="clientaccountentry",
            index=models.Index(fields=["client", "occurred_at"], name="core_client_client__bd4cb3_idx"),
        ),
    ]

