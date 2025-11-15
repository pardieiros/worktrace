from __future__ import annotations

import math
from datetime import date, datetime, time, timedelta

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


class ClientAccountEntry(models.Model):
    class EntryType(models.TextChoices):
        CHARGE = "charge", _("Charge")
        PAYMENT = "payment", _("Payment")

    client = models.ForeignKey(
        Client,
        related_name="account_entries",
        on_delete=models.CASCADE,
    )
    entry_type = models.CharField(
        max_length=20,
        choices=EntryType.choices,
        help_text=_("Defines whether the entry is a charge or a payment."),
    )
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text=_("Monetary amount for this entry."),
    )
    currency = models.CharField(max_length=8, default="EUR")
    occurred_at = models.DateField(default=timezone.now)
    reference = models.CharField(
        max_length=255,
        blank=True,
        help_text=_("Optional external reference such as invoice or payment code."),
    )
    description = models.CharField(
        max_length=255,
        blank=True,
        help_text=_("Short description displayed to administrators and clients."),
    )
    payment_method = models.CharField(
        max_length=64,
        blank=True,
        help_text=_("For payments, specifies how the amount was received."),
    )
    notes = models.TextField(blank=True)
    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="client_account_entries",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-occurred_at", "-created_at")
        verbose_name = _("Client account entry")
        verbose_name_plural = _("Client account entries")
        indexes = [
            models.Index(fields=("client", "entry_type")),
            models.Index(fields=("client", "occurred_at")),
        ]

    def __str__(self) -> str:
        return f"{self.client} - {self.entry_type} - {self.amount} {self.currency}"

    @property
    def signed_amount(self):
        if self.entry_type == self.EntryType.CHARGE:
            return self.amount
        return -self.amount


class SystemSettings(models.Model):
    id = models.PositiveSmallIntegerField(primary_key=True, default=1, editable=False)
    company_name = models.CharField(max_length=255, blank=True)
    company_legal_name = models.CharField(max_length=255, blank=True)
    company_email = models.EmailField(blank=True)
    company_phone = models.CharField(max_length=64, blank=True)
    company_website = models.URLField(blank=True)
    company_vat = models.CharField(max_length=64, blank=True)
    company_address = models.TextField(blank=True)
    support_email = models.EmailField(blank=True)
    billing_email = models.EmailField(blank=True)
    default_sender_name = models.CharField(max_length=255, blank=True)
    default_sender_email = models.EmailField(blank=True)
    reply_to_email = models.EmailField(blank=True)
    branding_logo = models.ImageField(upload_to="branding/", null=True, blank=True)
    smtp_host = models.CharField(max_length=255, blank=True)
    smtp_port = models.PositiveIntegerField(default=587)
    smtp_username = models.CharField(max_length=255, blank=True)
    smtp_password = models.TextField(blank=True)
    smtp_use_tls = models.BooleanField(default=True)
    smtp_use_ssl = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("System settings")
        verbose_name_plural = _("System settings")

    def __str__(self) -> str:
        return _("System settings")

    def save(self, *args, **kwargs) -> None:
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls) -> "SystemSettings":
        defaults = {"smtp_port": 587}
        instance, _ = cls.objects.get_or_create(pk=1, defaults=defaults)
        return instance


class Project(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", _("Active")
        PAUSED = "paused", _("Paused")
        ARCHIVED = "archived", _("Archived")

    class Visibility(models.TextChoices):
        INTERNAL = "internal", _("Internal")
        CLIENT = "client", _("Client visible")

    class BillingType(models.TextChoices):
        HOURLY = "hourly", _("Hourly")
        PACK = "pack", _("Hours pack")

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
    billing_type = models.CharField(
        max_length=20,
        choices=BillingType.choices,
        default=BillingType.HOURLY,
    )
    pack_hours = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_("Number of hours included in the pack."),
    )
    pack_total_value = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_("Total amount agreed for the pack of hours."),
    )
    hourly_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_("Hourly rate applied either after the pack or when no pack is defined."),
    )
    currency = models.CharField(max_length=8, default="EUR")
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
        if self.start and self.end:
            duration = self._calculate_duration(
                self.start,
                self.end,
                base_date=self.date,
            )
            if duration <= 0:
                raise ValidationError(_("Start time must be before end time."))
            self.duration_minutes = duration
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
    def _calculate_duration(
        start: time,
        end: time,
        *,
        base_date: date | None = None,
    ) -> int:
        reference_date = base_date or datetime.today().date()
        start_dt = datetime.combine(reference_date, start)
        end_dt = datetime.combine(reference_date, end)
        if end_dt <= start_dt:
            end_dt += timedelta(days=1)
        delta = end_dt - start_dt
        return int(delta.total_seconds() // 60)

    def _ensure_no_overlap(self) -> None:
        def _as_range(entry: "TimeEntry") -> tuple[datetime | None, datetime | None]:
            if entry.start and entry.end:
                start_dt = datetime.combine(entry.date, entry.start)
                end_dt = datetime.combine(entry.date, entry.end)
                if end_dt <= start_dt:
                    end_dt += timedelta(days=1)
                return start_dt, end_dt
            if entry.start and entry.duration_minutes > 0:
                start_dt = datetime.combine(entry.date, entry.start)
                end_dt = start_dt + timedelta(minutes=entry.duration_minutes)
                return start_dt, end_dt
            return None, None

        current_start, current_end = _as_range(self)
        if not current_start or not current_end:
            raise ValidationError(_("Time entry overlaps with an existing one."))

        candidate_dates = {self.date}
        if current_end.date() != current_start.date():
            candidate_dates.add(current_end.date())

        time_entries = (
            TimeEntry.objects.filter(
                user=self.user,
                date__in=candidate_dates,
            )
            .exclude(pk=self.pk)
            .only("start", "end", "duration_minutes", "date")
        )

        for other in time_entries:
            other_start, other_end = _as_range(other)
            if not other_start or not other_end:
                raise ValidationError(_("Time entry overlaps with an existing one."))
            if current_start < other_end and current_end > other_start:
                raise ValidationError(_("Time entry overlaps with an existing one."))


class TimeEntryTimerQuerySet(models.QuerySet):
    def active(self) -> "TimeEntryTimerQuerySet":
        return self.filter(
            status__in=(
                TimeEntryTimer.Status.RUNNING,
                TimeEntryTimer.Status.PAUSED,
            )
        )


class TimeEntryTimer(models.Model):
    class Status(models.TextChoices):
        RUNNING = "running", _("Running")
        PAUSED = "paused", _("Paused")

    project = models.ForeignKey(
        Project,
        related_name="timers",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="active_timers",
        on_delete=models.CASCADE,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.RUNNING,
    )
    started_at = models.DateTimeField(auto_now_add=True)
    last_resumed_at = models.DateTimeField(null=True, blank=True)
    accumulated_seconds = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = TimeEntryTimerQuerySet.as_manager()

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=("status",)),
            models.Index(fields=("project", "status")),
            models.Index(fields=("user", "status")),
        ]

    def __str__(self) -> str:
        return f"{self.project} - {self.user} ({self.status})"

    @property
    def elapsed_seconds(self) -> int:
        total = self.accumulated_seconds
        if (
            self.status == self.Status.RUNNING
            and self.last_resumed_at is not None
        ):
            delta = timezone.now() - self.last_resumed_at
            total += max(int(delta.total_seconds()), 0)
        return total

    def pause(self) -> None:
        if self.status != self.Status.RUNNING:
            raise ValidationError(_("Only running timers can be paused."))
        now = timezone.now()
        delta = now - self.last_resumed_at
        self.accumulated_seconds += max(int(delta.total_seconds()), 0)
        self.last_resumed_at = None
        self.status = self.Status.PAUSED
        self.save(update_fields=("accumulated_seconds", "last_resumed_at", "status", "updated_at"))

    def resume(self) -> None:
        if self.status != self.Status.PAUSED:
            raise ValidationError(_("Only paused timers can be resumed."))
        self.last_resumed_at = timezone.now()
        self.status = self.Status.RUNNING
        self.save(update_fields=("last_resumed_at", "status", "updated_at"))

    def complete(
        self,
        *,
        summary: str,
        task: str,
        billable: bool = True,
    ) -> TimeEntry:
        now = timezone.now()
        total_seconds = self.elapsed_seconds
        if total_seconds <= 0:
            total_seconds = 0
        duration_minutes = max(1, math.ceil(total_seconds / 60))
        start_local = timezone.localtime(self.started_at)
        end_local = timezone.localtime(now)
        entry_date = start_local.date()
        start_time = start_local.time()
        end_time = end_local.time()

        time_entry = TimeEntry.objects.create(
            project=self.project,
            user=self.user,
            date=entry_date,
            start=start_time,
            end=end_time,
            duration_minutes=duration_minutes,
            task=task,
            notes=summary,
            billable=billable,
        )
        self.delete()
        return time_entry

