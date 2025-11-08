from __future__ import annotations

from datetime import datetime, time, timedelta

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = "ADMIN", _("Admin")
        CLIENT = "CLIENT", _("Client")

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.ADMIN,
        help_text=_("Defines the access level within Worktrace."),
    )
    client = models.ForeignKey(
        "Client",
        related_name="users",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        help_text=_("Optional client association for client users."),
    )

    @property
    def is_admin(self) -> bool:
        return self.role == self.Roles.ADMIN

    @property
    def is_client(self) -> bool:
        return self.role == self.Roles.CLIENT


class Client(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    vat = models.CharField(max_length=32, blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    branding_logo = models.ImageField(upload_to="branding/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("name",)
        verbose_name = _("Client")
        verbose_name_plural = _("Clients")

    def __str__(self) -> str:
        return self.name


class Project(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", _("Active")
        PAUSED = "paused", _("Paused")
        ARCHIVED = "archived", _("Archived")

    class Visibility(models.TextChoices):
        INTERNAL = "internal", _("Internal")
        CLIENT = "client", _("Client visible")

    name = models.CharField(max_length=255)
    client = models.ForeignKey(
        Client,
        related_name="projects",
        on_delete=models.CASCADE,
    )
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    visibility = models.CharField(
        max_length=20,
        choices=Visibility.choices,
        default=Visibility.INTERNAL,
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="projects_created",
        on_delete=models.PROTECT,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_logged_minutes = models.PositiveIntegerField(default=0)
    last_logged_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("name",)
        indexes = [
            models.Index(fields=("client",)),
            models.Index(fields=("status",)),
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.client.name})"


class ProjectAssignment(models.Model):
    class AssignmentRole(models.TextChoices):
        MEMBER = "member", _("Member")
        MANAGER = "manager", _("Manager")

    project = models.ForeignKey(
        Project,
        related_name="assignments",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="assignments",
        on_delete=models.CASCADE,
    )
    role = models.CharField(
        max_length=20,
        choices=AssignmentRole.choices,
        default=AssignmentRole.MEMBER,
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("project", "user")
        verbose_name = _("Project Assignment")
        verbose_name_plural = _("Project Assignments")
        indexes = [
            models.Index(fields=("project", "is_active")),
            models.Index(fields=("user", "is_active")),
        ]

    def __str__(self) -> str:
        return f"{self.user} -> {self.project} ({self.role})"


class HourlyRate(models.Model):
    client = models.ForeignKey(
        Client,
        related_name="hourly_rates",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    project = models.ForeignKey(
        Project,
        related_name="hourly_rates",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    amount_decimal = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=8, default="EUR")
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-effective_from",)
        constraints = [
            models.CheckConstraint(
                check=(
                    models.Q(client__isnull=False)
                    | models.Q(project__isnull=False)
                ),
                name="hourly_rate_requires_target",
            ),
            models.CheckConstraint(
                check=~(
                    models.Q(client__isnull=False)
                    & models.Q(project__isnull=False)
                ),
                name="hourly_rate_single_scope",
            ),
        ]
        indexes = [
            models.Index(fields=("client", "effective_from")),
            models.Index(fields=("project", "effective_from")),
        ]

    def __str__(self) -> str:
        target = self.project or self.client
        return f"{target} - {self.amount_decimal} {self.currency}"


class TimeEntryQuerySet(models.QuerySet):
    def billable(self) -> "TimeEntryQuerySet":
        return self.filter(billable=True)

    def non_billable(self) -> "TimeEntryQuerySet":
        return self.filter(billable=False)

    def for_period(
        self,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> "TimeEntryQuerySet":
        queryset = self
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        return queryset


class TimeEntry(models.Model):
    project = models.ForeignKey(
        Project,
        related_name="time_entries",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="time_entries",
        on_delete=models.CASCADE,
    )
    date = models.DateField()
    start = models.TimeField(null=True, blank=True)
    end = models.TimeField(null=True, blank=True)
    duration_minutes = models.PositiveIntegerField(default=0)
    task = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    billable = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = TimeEntryQuerySet.as_manager()

    class Meta:
        indexes = [
            models.Index(fields=("project", "date")),
            models.Index(fields=("user", "date")),
            models.Index(fields=("project", "billable")),
        ]
        ordering = ("-date", "-start")

    def __str__(self) -> str:
        return f"{self.user} - {self.project} ({self.date})"

    def clean(self) -> None:
        if self.start and self.end and self.start >= self.end:
            raise ValidationError(_("Start time must be before end time."))

        if self.start and self.end:
            self.duration_minutes = self._calculate_duration(self.start, self.end)
        elif self.duration_minutes <= 0:
            raise ValidationError(
                _("Either provide start/end times or set duration_minutes.")
            )

        if (
            not settings.TIMEENTRY_ALLOW_OVERLAP
            and self.start
            and self.end
        ):
            self._ensure_no_overlap()

    def save(self, *args, **kwargs) -> None:
        self.full_clean()
        super().save(*args, **kwargs)

    @staticmethod
    def _calculate_duration(start: time, end: time) -> int:
        start_dt = datetime.combine(datetime.today().date(), start)
        end_dt = datetime.combine(datetime.today().date(), end)
        delta = end_dt - start_dt
        return int(delta.total_seconds() // 60)

    def _ensure_no_overlap(self) -> None:
        time_entries = TimeEntry.objects.filter(
            user=self.user,
            date=self.date,
        ).exclude(pk=self.pk)
        overlap_exists = time_entries.filter(
            models.Q(
                start__isnull=False,
                end__isnull=False,
                start__lt=self.end,
                end__gt=self.start,
            )
            | models.Q(
                start__isnull=True,
                end__isnull=True,
                duration_minutes__gt=0,
            )
        ).exists()
        if overlap_exists:
            raise ValidationError(_("Time entry overlaps with an existing one."))

