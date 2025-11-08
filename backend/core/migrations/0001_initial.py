from __future__ import annotations

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="Client",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255)),
                ("email", models.EmailField(max_length=254)),
                ("vat", models.CharField(blank=True, max_length=32)),
                ("notes", models.TextField(blank=True)),
                ("is_active", models.BooleanField(default=True)),
                ("branding_logo", models.ImageField(blank=True, null=True, upload_to="branding/")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Client",
                "verbose_name_plural": "Clients",
                "ordering": ("name",),
            },
        ),
        migrations.CreateModel(
            name="User",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                ("last_login", models.DateTimeField(blank=True, null=True, verbose_name="last login")),
                ("is_superuser", models.BooleanField(default=False, help_text="Designates that this user has all permissions without explicitly assigning them.", verbose_name="superuser status")),
                ("username", models.CharField(error_messages={"unique": "A user with that username already exists."}, help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.", max_length=150, unique=True, verbose_name="username")),
                ("first_name", models.CharField(blank=True, max_length=150, verbose_name="first name")),
                ("last_name", models.CharField(blank=True, max_length=150, verbose_name="last name")),
                ("email", models.EmailField(blank=True, max_length=254, verbose_name="email address")),
                ("is_staff", models.BooleanField(default=False, help_text="Designates whether the user can log into this admin site.", verbose_name="staff status")),
                ("is_active", models.BooleanField(default=True, help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.", verbose_name="active")),
                ("date_joined", models.DateTimeField(default=django.utils.timezone.now, verbose_name="date joined")),
                ("role", models.CharField(choices=[("ADMIN", "Admin"), ("CLIENT", "Client")], default="ADMIN", help_text="Defines the access level within Worktrace.", max_length=20)),
                ("client", models.ForeignKey(blank=True, help_text="Optional client association for client users.", null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="users", to="core.client")),
                ("groups", models.ManyToManyField(blank=True, help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.", related_name="user_set", related_query_name="user", to="auth.group", verbose_name="groups")),
                ("user_permissions", models.ManyToManyField(blank=True, help_text="Specific permissions for this user.", related_name="user_set", related_query_name="user", to="auth.permission", verbose_name="user permissions")),
            ],
            options={
                "verbose_name": "user",
                "verbose_name_plural": "users",
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Project",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True)),
                ("status", models.CharField(choices=[("active", "Active"), ("paused", "Paused"), ("archived", "Archived")], default="active", max_length=20)),
                ("visibility", models.CharField(choices=[("internal", "Internal"), ("client", "Client visible")], default="internal", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("total_logged_minutes", models.PositiveIntegerField(default=0)),
                ("last_logged_at", models.DateTimeField(blank=True, null=True)),
                ("client", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="projects", to="core.client")),
                ("created_by", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="projects_created", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ("name",),
            },
        ),
        migrations.CreateModel(
            name="HourlyRate",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("amount_decimal", models.DecimalField(decimal_places=2, max_digits=10)),
                ("currency", models.CharField(default="EUR", max_length=8)),
                ("effective_from", models.DateField()),
                ("effective_to", models.DateField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("client", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="hourly_rates", to="core.client")),
                ("project", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="hourly_rates", to="core.project")),
            ],
            options={
                "ordering": ("-effective_from",),
            },
        ),
        migrations.CreateModel(
            name="ProjectAssignment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("role", models.CharField(choices=[("member", "Member"), ("manager", "Manager")], default="member", max_length=20)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("project", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="assignments", to="core.project")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="assignments", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "verbose_name": "Project Assignment",
                "verbose_name_plural": "Project Assignments",
            },
        ),
        migrations.CreateModel(
            name="TimeEntry",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("date", models.DateField()),
                ("start", models.TimeField(blank=True, null=True)),
                ("end", models.TimeField(blank=True, null=True)),
                ("duration_minutes", models.PositiveIntegerField(default=0)),
                ("task", models.CharField(max_length=255)),
                ("notes", models.TextField(blank=True)),
                ("billable", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("project", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="time_entries", to="core.project")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="time_entries", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ("-date", "-start"),
            },
        ),
        migrations.AddIndex(
            model_name="project",
            index=models.Index(fields=["client"], name="core_projec_client__aabc63_idx"),
        ),
        migrations.AddIndex(
            model_name="project",
            index=models.Index(fields=["status"], name="core_projec_status_170c98_idx"),
        ),
        migrations.AddConstraint(
            model_name="hourlyrate",
            constraint=models.CheckConstraint(check=models.Q(("client__isnull", False)) | models.Q(("project__isnull", False)), name="hourly_rate_requires_target"),
        ),
        migrations.AddConstraint(
            model_name="hourlyrate",
            constraint=models.CheckConstraint(check=~(models.Q(("client__isnull", False)) & models.Q(("project__isnull", False))), name="hourly_rate_single_scope"),
        ),
        migrations.AddIndex(
            model_name="hourlyrate",
            index=models.Index(fields=["client", "effective_from"], name="core_hourly_client__5cf55d_idx"),
        ),
        migrations.AddIndex(
            model_name="hourlyrate",
            index=models.Index(fields=["project", "effective_from"], name="core_hourly_project_08ed13_idx"),
        ),
        migrations.AlterModelOptions(
            name="projectassignment",
            options={"verbose_name": "Project Assignment", "verbose_name_plural": "Project Assignments"},
        ),
        migrations.AddIndex(
            model_name="projectassignment",
            index=models.Index(fields=["project", "is_active"], name="core_projec_project_2d702c_idx"),
        ),
        migrations.AddIndex(
            model_name="projectassignment",
            index=models.Index(fields=["user", "is_active"], name="core_projec_user_id_52dc19_idx"),
        ),
        migrations.AlterUniqueTogether(
            name="projectassignment",
            unique_together={("project", "user")},
        ),
        migrations.AddIndex(
            model_name="timeentry",
            index=models.Index(fields=["project", "date"], name="core_timeen_project_427f20_idx"),
        ),
        migrations.AddIndex(
            model_name="timeentry",
            index=models.Index(fields=["user", "date"], name="core_timeen_user_id_8dea18_idx"),
        ),
        migrations.AddIndex(
            model_name="timeentry",
            index=models.Index(fields=["project", "billable"], name="core_timeen_project_651dd3_idx"),
        ),
    ]

