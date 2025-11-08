from __future__ import annotations

import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone

from core import models


@pytest.mark.django_db
def test_time_entry_duration_calculates(project, admin_user):
    entry = models.TimeEntry(
        project=project,
        user=admin_user,
        date=timezone.now().date(),
        start=timezone.datetime(2024, 1, 1, 9, 0).time(),
        end=timezone.datetime(2024, 1, 1, 10, 30).time(),
        task="Development",
        notes="Initial work",
        billable=True,
    )
    entry.save()
    assert entry.duration_minutes == 90


@pytest.mark.django_db
def test_time_entry_overlap_raises(project, admin_user):
    date = timezone.now().date()
    models.TimeEntry.objects.create(
        project=project,
        user=admin_user,
        date=date,
        start=timezone.datetime(2024, 1, 1, 9, 0).time(),
        end=timezone.datetime(2024, 1, 1, 11, 0).time(),
        task="First",
        notes="",
    )
    with pytest.raises(ValidationError):
        models.TimeEntry.objects.create(
            project=project,
            user=admin_user,
            date=date,
            start=timezone.datetime(2024, 1, 1, 10, 0).time(),
            end=timezone.datetime(2024, 1, 1, 12, 0).time(),
            task="Overlap",
            notes="",
        )


@pytest.mark.django_db
def test_project_metrics_update(project, admin_user):
    date = timezone.now().date()
    models.TimeEntry.objects.create(
        project=project,
        user=admin_user,
        date=date,
        duration_minutes=120,
        task="Backend",
        notes="",
    )
    project.refresh_from_db()
    assert project.total_logged_minutes == 120

