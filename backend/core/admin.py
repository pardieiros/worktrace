from __future__ import annotations

from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from . import models


@admin.register(models.User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "role", "client", "is_active")
    list_filter = ("role", "is_active")
    search_fields = ("username", "email", "first_name", "last_name")
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email", "client")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "role",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    ordering = ("username",)


@admin.register(models.Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "vat", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "email", "vat")


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "client",
        "status",
        "visibility",
        "total_logged_minutes",
        "created_at",
    )
    list_filter = ("status", "visibility", "client")
    search_fields = ("name", "description")
    raw_id_fields = ("client", "created_by")


@admin.register(models.ProjectAssignment)
class ProjectAssignmentAdmin(admin.ModelAdmin):
    list_display = ("project", "user", "role", "is_active")
    list_filter = ("role", "is_active")
    search_fields = ("project__name", "user__username")
    raw_id_fields = ("project", "user")


@admin.register(models.HourlyRate)
class HourlyRateAdmin(admin.ModelAdmin):
    list_display = (
        "client",
        "project",
        "amount_decimal",
        "currency",
        "effective_from",
        "effective_to",
    )
    list_filter = ("currency", "client")
    search_fields = ("client__name", "project__name")
    raw_id_fields = ("client", "project")


@admin.register(models.TimeEntry)
class TimeEntryAdmin(admin.ModelAdmin):
    list_display = (
        "project",
        "user",
        "date",
        "start",
        "end",
        "duration_minutes",
        "billable",
        "created_at",
    )
    list_filter = ("billable", "date", "project")
    search_fields = ("project__name", "user__username", "task", "notes")
    raw_id_fields = ("project", "user")


@admin.register(models.SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        (
            _("Company"),
            {
                "fields": (
                    "company_name",
                    "company_legal_name",
                    "company_email",
                    "company_phone",
                    "company_website",
                    "company_vat",
                    "company_address",
                    "branding_logo",
                )
            },
        ),
        (
            _("Support & billing"),
            {"fields": ("support_email", "billing_email")},
        ),
        (
            _("Email defaults"),
            {
                "fields": (
                    "default_sender_name",
                    "default_sender_email",
                    "reply_to_email",
                )
            },
        ),
        (
            _("SMTP"),
            {
                "fields": (
                    "smtp_host",
                    "smtp_port",
                    "smtp_username",
                    "smtp_password",
                    "smtp_use_tls",
                    "smtp_use_ssl",
                )
            },
        ),
        (_("Metadata"), {"fields": ("created_at", "updated_at")}),
    )
    readonly_fields = ("created_at", "updated_at")

