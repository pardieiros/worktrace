from __future__ import annotations

from django.db import models
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import Project, TimeEntry


def _refresh_project_metrics(project: Project) -> None:
    aggregates = project.time_entries.aggregate(
        total_minutes=models.Sum("duration_minutes"),
        last_logged=models.Max("created_at"),
    )
    project.total_logged_minutes = aggregates.get("total_minutes") or 0
    project.last_logged_at = aggregates.get("last_logged")
    project.save(update_fields=["total_logged_minutes", "last_logged_at", "updated_at"])


@receiver(post_save, sender=TimeEntry)
def time_entry_saved(sender, instance: TimeEntry, **kwargs) -> None:
    _refresh_project_metrics(instance.project)


@receiver(post_delete, sender=TimeEntry)
def time_entry_deleted(sender, instance: TimeEntry, **kwargs) -> None:
    _refresh_project_metrics(instance.project)

