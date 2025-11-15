from __future__ import annotations

from decimal import Decimal

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


@pytest.mark.django_db
def test_client_account_summary_returns_expected_data(api_client, admin_user, client_obj):
    pack_project = models.Project.objects.create(
        name="Pack UX",
        client=client_obj,
        created_by=admin_user,
        billing_type=models.Project.BillingType.PACK,
        pack_hours=50,
        pack_total_value=Decimal("500.00"),
        currency="EUR",
    )
    models.ClientAccountEntry.objects.create(
        client=client_obj,
        entry_type=models.ClientAccountEntry.EntryType.CHARGE,
        amount=Decimal("150.00"),
        currency="EUR",
        description="Invoice INV-001",
        occurred_at=timezone.now().date(),
        recorded_by=admin_user,
    )
    models.ClientAccountEntry.objects.create(
        client=client_obj,
        entry_type=models.ClientAccountEntry.EntryType.PAYMENT,
        amount=Decimal("40.00"),
        currency="EUR",
        payment_method="bank-transfer",
        occurred_at=timezone.now().date(),
        recorded_by=admin_user,
    )

    login_response = api_client.post(
        reverse("auth-login"),
        {"email": admin_user.email, "password": "password123"},
        format="json",
    )
    assert login_response.status_code == 200

    response = api_client.get(reverse("client-account", args=[client_obj.pk]))
    assert response.status_code == 200

    assert Decimal(response.data["total_charged"]) == Decimal("650.00")
    assert Decimal(response.data["total_paid"]) == Decimal("40.00")
    assert Decimal(response.data["balance"]) == Decimal("610.00")
    assert response.data["currency"] == "EUR"
    assert Decimal(response.data["pack_total_due"]) == Decimal("500.00")
    assert Decimal(response.data["hourly_total_due"]) == Decimal("0.00")
    assert len(response.data["pack_projects"]) == 1
    assert response.data["hourly_projects"] == []
    pack_payload = response.data["pack_projects"][0]
    assert pack_payload["id"] == pack_project.id
    assert pack_payload["name"] == "Pack UX"
    assert pack_payload["pack_total_value"] == "500.00"
    assert pack_payload["pack_hours"] == "50.00"
    assert pack_payload["status"] == models.Project.Status.ACTIVE
    assert pack_payload["currency"] == "EUR"
    assert len(response.data["entries"]) == 2


@pytest.mark.django_db
def test_client_account_summary_includes_hourly_work(api_client, admin_user, client_obj):
    hourly_project = models.Project.objects.create(
        name="Hourly Strategy",
        client=client_obj,
        created_by=admin_user,
        billing_type=models.Project.BillingType.HOURLY,
        hourly_rate=Decimal("80.00"),
        currency="EUR",
    )
    models.TimeEntry.objects.create(
        project=hourly_project,
        user=admin_user,
        date=timezone.now().date(),
        duration_minutes=150,
        task="Workshop facilitation",
        notes="Strategy discovery session",
        billable=True,
    )

    login_response = api_client.post(
        reverse("auth-login"),
        {"email": admin_user.email, "password": "password123"},
        format="json",
    )
    assert login_response.status_code == 200

    response = api_client.get(reverse("client-account", args=[client_obj.pk]))
    assert response.status_code == 200

    assert Decimal(response.data["total_charged"]) == Decimal("200.00")
    assert Decimal(response.data["hourly_total_due"]) == Decimal("200.00")
    assert Decimal(response.data["balance"]) == Decimal("200.00")
    assert Decimal(response.data["total_paid"]) == Decimal("0")
    assert len(response.data["hourly_projects"]) == 1
    hourly_payload = response.data["hourly_projects"][0]
    assert hourly_payload["id"] == hourly_project.id
    assert hourly_payload["name"] == "Hourly Strategy"
    assert hourly_payload["billable_minutes"] == 150
    assert hourly_payload["billable_hours"] == "2.50"
    assert hourly_payload["amount"] == "200.00"
    assert hourly_payload["currency"] == "EUR"


@pytest.mark.django_db
def test_create_client_payment_records_entry(api_client, admin_user, client_obj):
    login_response = api_client.post(
        reverse("auth-login"),
        {"email": admin_user.email, "password": "password123"},
        format="json",
    )
    assert login_response.status_code == 200

    payload = {
        "amount": "75.50",
        "currency": "EUR",
        "occurred_at": timezone.now().date().isoformat(),
        "payment_method": "credit-card",
        "reference": "RCPT-100",
        "description": "Payment received",
        "notes": "Processed via manual entry.",
    }

    response = api_client.post(
        reverse("client-create-payment", args=[client_obj.pk]),
        payload,
        format="json",
    )
    assert response.status_code == 201
    data = response.data
    assert data["entry_type"] == models.ClientAccountEntry.EntryType.PAYMENT
    assert data["payment_method"] == "credit-card"
    assert data["reference"] == "RCPT-100"

    entry = models.ClientAccountEntry.objects.get(pk=data["id"])
    assert entry.client == client_obj
    assert entry.recorded_by == admin_user
