from __future__ import annotations

from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"clients", views.ClientViewSet, basename="client")
router.register(r"projects", views.ProjectViewSet, basename="project")
router.register(r"assignments", views.ProjectAssignmentViewSet, basename="assignment")
router.register(r"hourly-rates", views.HourlyRateViewSet, basename="hourlyrate")
router.register(r"time-entries", views.TimeEntryViewSet, basename="timeentry")

urlpatterns = [
    path("auth/login", views.LoginView.as_view(), name="auth-login"),
    path("auth/logout", views.LogoutView.as_view(), name="auth-logout"),
    path("auth/refresh", views.RefreshView.as_view(), name="auth-refresh"),
    path("auth/me", views.MeView.as_view(), name="auth-me"),
    path("reports/summary", views.ReportSummaryView.as_view(), name="reports-summary"),
    path("reports/export.csv", views.ReportExportCsvView.as_view(), name="reports-export-csv"),
    path("reports/export.pdf", views.ReportExportPdfView.as_view(), name="reports-export-pdf"),
    path("health/", views.HealthView.as_view(), name="health"),
    path("", include(router.urls)),
]

