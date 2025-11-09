from __future__ import annotations

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="billing_type",
            field=models.CharField(
                choices=[("hourly", "Hourly"), ("pack", "Hours pack")],
                default="hourly",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="project",
            name="currency",
            field=models.CharField(default="EUR", max_length=8),
        ),
        migrations.AddField(
            model_name="project",
            name="hourly_rate",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text="Hourly rate applied either after the pack or when no pack is defined.",
                max_digits=10,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="project",
            name="pack_hours",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text="Number of hours included in the pack.",
                max_digits=10,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="project",
            name="pack_total_value",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text="Total amount agreed for the pack of hours.",
                max_digits=12,
                null=True,
            ),
        ),
    ]


