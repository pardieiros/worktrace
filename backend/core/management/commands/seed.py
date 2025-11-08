from __future__ import annotations

from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from core import models


class Command(BaseCommand):
    help = "Populate the database with demo data for Worktrace."

    def handle(self, *args, **options):
        User = get_user_model()

        admin, _ = User.objects.get_or_create(
            username="demo-admin",
            defaults={
                "email": "admin@worktrace.demo",
                "role": User.Roles.ADMIN,
            },
        )
        if not admin.has_usable_password():
            admin.set_password("demo1234")
            admin.is_staff = True
            admin.is_superuser = True
            admin.save()

        client_user, _ = User.objects.get_or_create(
            username="demo-client",
            defaults={
                "email": "client@worktrace.demo",
                "role": User.Roles.CLIENT,
            },
        )
        if not client_user.has_usable_password():
            client_user.set_password("demo1234")
            client_user.save()

        client, _ = models.Client.objects.get_or_create(
            name="Demo Client",
            defaults={
                "email": "client@worktrace.demo",
                "vat": "PT123456789",
                "notes": "Demo client created by seed command.",
            },
        )
        client_user.client = client
        client_user.save(update_fields=["client"])

        project_alpha, _ = models.Project.objects.get_or_create(
            name="Alpha",
            client=client,
            defaults={
                "description": "Internal tooling and automation.",
                "status": models.Project.Status.ACTIVE,
                "visibility": models.Project.Visibility.CLIENT,
                "created_by": admin,
            },
        )
        project_beta, _ = models.Project.objects.get_or_create(
            name="Beta",
            client=client,
            defaults={
                "description": "Client-facing improvements.",
                "status": models.Project.Status.ACTIVE,
                "visibility": models.Project.Visibility.CLIENT,
                "created_by": admin,
            },
        )

        models.ProjectAssignment.objects.get_or_create(
            project=project_alpha,
            user=admin,
            defaults={"role": models.ProjectAssignment.AssignmentRole.MANAGER},
        )
        models.ProjectAssignment.objects.get_or_create(
            project=project_alpha,
            user=client_user,
            defaults={"role": models.ProjectAssignment.AssignmentRole.MEMBER},
        )
        models.ProjectAssignment.objects.get_or_create(
            project=project_beta,
            user=client_user,
            defaults={"role": models.ProjectAssignment.AssignmentRole.MEMBER},
        )

        models.HourlyRate.objects.get_or_create(
            client=client,
            project=None,
            defaults={
                "amount_decimal": Decimal("75.00"),
                "currency": "EUR",
                "effective_from": timezone.now().date() - timedelta(days=30),
            },
        )
        models.HourlyRate.objects.get_or_create(
            project=project_alpha,
            defaults={
                "amount_decimal": Decimal("90.00"),
                "currency": "EUR",
                "effective_from": timezone.now().date() - timedelta(days=10),
            },
        )

        today = timezone.now().date()
        for offset in range(5):
            models.TimeEntry.objects.get_or_create(
                project=project_alpha,
                user=admin,
                date=today - timedelta(days=offset),
                defaults={
                    "duration_minutes": 120,
                    "task": "Feature work",
                    "notes": f"Iteration {offset}",
                    "billable": True,
                },
            )

        self.stdout.write(self.style.SUCCESS("Demo data created successfully."))

