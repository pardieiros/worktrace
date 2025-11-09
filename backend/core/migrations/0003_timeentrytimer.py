from __future__ import annotations

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0002_project_billing_fields"),
    ]

    operations = [
        migrations.CreateModel(
            name="TimeEntryTimer",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("status", models.CharField(choices=[("running", "Running"), ("paused", "Paused")], default="running", max_length=20)),
                ("started_at", models.DateTimeField(auto_now_add=True)),
                ("last_resumed_at", models.DateTimeField(blank=True, null=True)),
                ("accumulated_seconds", models.PositiveIntegerField(default=0)),
                ("notes", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "project",
                    models.ForeignKey(
                        on_delete=models.deletion.CASCADE,
                        related_name="timers",
                        to="core.project",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=models.deletion.CASCADE,
                        related_name="active_timers",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ("-created_at",),
            },
        ),
        migrations.AddIndex(
            model_name="timeentrytimer",
            index=models.Index(fields=["status"], name="core_timeen_status_b901a0_idx"),
        ),
        migrations.AddIndex(
            model_name="timeentrytimer",
            index=models.Index(fields=["project", "status"], name="core_timeen_project_50a781_idx"),
        ),
        migrations.AddIndex(
            model_name="timeentrytimer",
            index=models.Index(fields=["user", "status"], name="core_timeen_user_id_5b1970_idx"),
        ),
    ]

