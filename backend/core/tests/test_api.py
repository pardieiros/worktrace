from __future__ import annotations

import pytest
from django.urls import reverse
from django.utils import timezone

from core import models


@pytest.mark.django_db
def test_login_sets_cookies(api_client, admin_user):
    response = api_client.post(
        reverse("auth-login"),
        {"email": admin_user.email, "password": "password123"},
        format="json",
    )
    assert response.status_code == 200
    assert "worktrace_access" in response.cookies
    assert response.data["user"]["email"] == admin_user.email


@pytest.mark.django_db
def test_projects_list_for_client(api_client, client_user, project):
    other_client = models.Client.objects.create(name="Other", email="other@example.com")
    models.Project.objects.create(
        name="Hidden",
        client=other_client,
        created_by=project.created_by,
        visibility=models.Project.Visibility.CLIENT,
    )

    response = api_client.post(
        reverse("auth-login"),
        {"email": client_user.email, "password": "password123"},
        format="json",
    )
    assert response.status_code == 200

    list_response = api_client.get(reverse("project-list"))
    assert list_response.status_code == 200
    names = [item["name"] for item in list_response.data["results"]]
    assert "Project Alpha" in names
    assert "Hidden" not in names


@pytest.mark.django_db
def test_reports_summary_returns_data(api_client, admin_user, project):
    models.TimeEntry.objects.create(
        project=project,
        user=admin_user,
        date=timezone.now().date(),
        duration_minutes=60,
        task="Planning",
        notes="",
    )
    response = api_client.post(
        reverse("auth-login"),
        {"email": admin_user.email, "password": "password123"},
        format="json",
    )
    assert response.status_code == 200

    report_response = api_client.get(reverse("reports-summary"))
    assert report_response.status_code == 200
    assert report_response.data

