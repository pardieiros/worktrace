from __future__ import annotations

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers import ReportSummarySerializer
from ..services import reporting


class ReportBaseView(APIView):
    permission_classes = [IsAuthenticated]

    def build_filters(self, request) -> reporting.ReportFilters:
        params = request.query_params
        billable_param = params.get("billable")
        billable = None
        if billable_param is not None:
            billable = billable_param.lower() in {"1", "true", "yes"}
        return reporting.ReportFilters(
            client_id=self._to_int(params.get("client")),
            project_id=self._to_int(params.get("project")),
            user_id=self._to_int(params.get("user")),
            date_from=params.get("from"),
            date_to=params.get("to"),
            billable=billable,
        )

    @staticmethod
    def _to_int(value):
        if value is None:
            return None
        try:
            return int(value)
        except ValueError:
            return None


class ReportSummaryView(ReportBaseView):
    def get(self, request):
        filters = self.build_filters(request)
        rows = reporting.summarize(request.user, filters)
        serializer = ReportSummarySerializer(rows, many=True)
        return Response(serializer.data)


class ReportExportCsvView(ReportBaseView):
    def get(self, request):
        filters = self.build_filters(request)
        rows = reporting.summarize(request.user, filters)
        return reporting.export_csv(rows)


class ReportExportPdfView(ReportBaseView):
    def get(self, request):
        filters = self.build_filters(request)
        rows = reporting.summarize(request.user, filters)
        return reporting.export_pdf(rows)


