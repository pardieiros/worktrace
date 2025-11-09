from __future__ import annotations

import django_filters

from . import models


class ClientFilter(django_filters.FilterSet):
    class Meta:
        model = models.Client
        fields = {
            "name": ["icontains"],
            "email": ["icontains"],
            "is_active": ["exact"],
        }


class ProjectFilter(django_filters.FilterSet):
    class Meta:
        model = models.Project
        fields = {
            "client": ["exact"],
            "status": ["exact"],
            "visibility": ["exact"],
        }


class TimeEntryFilter(django_filters.FilterSet):
    from_date = django_filters.DateFilter(field_name="date", lookup_expr="gte")
    to_date = django_filters.DateFilter(field_name="date", lookup_expr="lte")
    billable = django_filters.BooleanFilter(field_name="billable")

    class Meta:
        model = models.TimeEntry
        fields = {
            "project": ["exact"],
            "user": ["exact"],
        }


