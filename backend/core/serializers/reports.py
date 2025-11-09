from __future__ import annotations

from rest_framework import serializers


class ReportSummarySerializer(serializers.Serializer):
    client = serializers.CharField(allow_null=True)
    project = serializers.CharField(allow_null=True)
    user = serializers.CharField(allow_null=True)
    total_minutes = serializers.IntegerField()
    billable_minutes = serializers.IntegerField()
    non_billable_minutes = serializers.IntegerField()
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2, allow_null=True)


