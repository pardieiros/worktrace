import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { TimeEntriesTable } from "@/components/pages/timeEntries/TimeEntriesTable";
import { TimeEntryDetailDialog } from "@/components/pages/timeEntries/TimeEntryDetailDialog";
import { formatDuration, getElapsedSeconds } from "@/components/pages/timeEntries/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createTimer,
  fetchProjects,
  fetchTimeEntries,
  fetchTimers,
  pauseTimer,
  resumeTimer,
  stopTimer
} from "@/lib/queries";
import type { CreateTimerPayload, StopTimerPayload } from "@/lib/queries";
import api from "@/lib/api";
import type { Project, TimeEntry, TimeEntryTimer } from "@/lib/types";

type ActiveTimer = TimeEntryTimer & { elapsedSeconds: number };

const parseErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") {
      return detail;
    }
    if (error.response?.data && typeof error.response.data === "object") {
      const firstValue = Object.values(error.response.data)[0];
      if (typeof firstValue === "string") {
        return firstValue;
      }
    }
  }
  return fallback;
};

export function AdminTimeEntriesPage() {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({
    project: "",
    from: "",
    to: ""
  });
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [startForm, setStartForm] = useState<{ projectId: string; notes: string }>({
    projectId: "",
    notes: ""
  });
  const [startError, setStartError] = useState<string | null>(null);
  const [timerActionError, setTimerActionError] = useState<string | null>(null);
  const [stopModalTimer, setStopModalTimer] = useState<ActiveTimer | null>(null);
  const [stopForm, setStopForm] = useState<{ summary: string; task: string; billable: boolean }>({
    summary: "",
    task: "",
    billable: true
  });
  const [stopError, setStopError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [tick, setTick] = useState(() => Date.now());

  const locale = useMemo(() => {
    const language = i18n.language.split("-")[0];
    switch (language) {
      case "pt":
        return "pt-PT";
      case "es":
        return "es-ES";
      case "fr":
        return "fr-FR";
      default:
        return "en-US";
    }
  }, [i18n.language]);

  useEffect(() => {
    const intervalId = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const { data: entriesData, isLoading: isLoadingEntries } = useQuery({
    queryKey: ["time-entries", filters],
    queryFn: () =>
      fetchTimeEntries({
        project: filters.project || undefined,
        from_date: filters.from || undefined,
        to_date: filters.to || undefined
      })
  });

  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects({ page_size: 100 })
  });

  const {
    data: timersData,
    isLoading: isLoadingTimers,
    refetch: refetchTimers
  } = useQuery({
    queryKey: ["time-entry-timers"],
    queryFn: () => fetchTimers({ page_size: 100 }),
    refetchInterval: 15000
  });

  const projects = useMemo(() => projectsData?.results ?? [], [projectsData]);

  const activeTimers = useMemo<ActiveTimer[]>(() => {
    const timers = timersData?.results ?? [];
    return timers.map((timer) => ({
      ...timer,
      elapsedSeconds: getElapsedSeconds(timer, tick)
    }));
  }, [timersData, tick]);

  const createTimerMutation = useMutation<TimeEntryTimer, unknown, CreateTimerPayload>({
    mutationFn: (payload) => createTimer(payload),
    onSuccess: () => {
      setStartError(null);
      setIsStartModalOpen(false);
      setStartForm({ projectId: "", notes: "" });
      void queryClient.invalidateQueries({ queryKey: ["time-entry-timers"] });
    },
    onError: (error) => {
      setStartError(parseErrorMessage(error, t("admin.timeEntries.errors.start")));
    }
  });

  const pauseTimerMutation = useMutation<TimeEntryTimer, unknown, number>({
    mutationFn: (id: number) => pauseTimer(id),
    onSuccess: () => {
      setTimerActionError(null);
      void queryClient.invalidateQueries({ queryKey: ["time-entry-timers"] });
    },
    onError: (error) => {
      setTimerActionError(parseErrorMessage(error, t("admin.timeEntries.errors.pause")));
    }
  });

  const resumeTimerMutation = useMutation<TimeEntryTimer, unknown, number>({
    mutationFn: (id: number) => resumeTimer(id),
    onSuccess: () => {
      setTimerActionError(null);
      void queryClient.invalidateQueries({ queryKey: ["time-entry-timers"] });
    },
    onError: (error) => {
      setTimerActionError(parseErrorMessage(error, t("admin.timeEntries.errors.resume")));
    }
  });

  const stopTimerMutation = useMutation<TimeEntry, unknown, { id: number; payload: StopTimerPayload }>({
    mutationFn: ({ id, payload }: { id: number; payload: StopTimerPayload }) =>
      stopTimer(id, payload),
    onSuccess: () => {
      setStopError(null);
      setStopModalTimer(null);
      setStopForm({ summary: "", task: "", billable: true });
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["time-entry-timers"] }),
        queryClient.invalidateQueries({ queryKey: ["time-entries"] })
      ]);
    },
    onError: (error) => {
      setStopError(parseErrorMessage(error, t("admin.timeEntries.errors.stop")));
    }
  });

  const handleExport = async (format: "csv" | "pdf") => {
    const endpoint = format === "csv" ? "/reports/export.csv" : "/reports/export.pdf";
    const response = await api.get(endpoint, {
      params: {
        project: filters.project || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined
      },
      responseType: "blob"
    });
    const blob = new Blob([response.data], {
      type: format === "csv" ? "text/csv" : "application/pdf"
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `worktrace-report.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartTimerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!startForm.projectId) {
      setStartError(t("admin.timeEntries.validations.projectRequired"));
      return;
    }
    const payload: CreateTimerPayload = {
      project: Number(startForm.projectId)
    };
    if (startForm.notes.trim()) {
      payload.notes = startForm.notes.trim();
    }
    createTimerMutation.mutate(payload);
  };

  const handleStopSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stopForm.summary.trim()) {
      setStopError(t("admin.timeEntries.validations.summaryRequired"));
      return;
    }
    if (!stopModalTimer) {
      return;
    }
    const payload: StopTimerPayload = {
      summary: stopForm.summary.trim(),
      billable: stopForm.billable
    };
    if (stopForm.task.trim()) {
      payload.task = stopForm.task.trim();
    }
    stopTimerMutation.mutate({ id: stopModalTimer.id, payload });
  };

  const handlePause = (timer: ActiveTimer) => {
    pauseTimerMutation.mutate(timer.id);
  };

  const handleResume = (timer: ActiveTimer) => {
    resumeTimerMutation.mutate(timer.id);
  };

  const openStopModal = (timer: ActiveTimer) => {
    setStopModalTimer(timer);
    setStopForm({
      summary: "",
      task: "",
      billable: true
    });
    setStopError(null);
  };

  const entries = entriesData?.results ?? [];
  const isTimersMutationPending =
    pauseTimerMutation.isPending ||
    resumeTimerMutation.isPending ||
    stopTimerMutation.isPending ||
    createTimerMutation.isPending;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text">{t("admin.timeEntries.title")}</h1>
          <p className="text-sm text-primary/70">{t("admin.timeEntries.subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => handleExport("csv")}>
            {t("admin.timeEntries.actions.exportCsv")}
          </Button>
          <Button type="button" variant="outline" onClick={() => handleExport("pdf")}>
            {t("admin.timeEntries.actions.exportPdf")}
          </Button>
          <Button type="button" onClick={() => setIsStartModalOpen(true)}>
            {t("admin.timeEntries.actions.startTimer")}
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="text-sm font-medium text-text" htmlFor="project-select">
              {t("admin.timeEntries.filters.projectLabel")}
            </label>
            <select
              id="project-select"
              className="mt-1 w-full rounded-md border border-primary/25 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={filters.project}
              onChange={(event) => setFilters((prev) => ({ ...prev, project: event.target.value }))}
            >
              <option value="">{t("admin.timeEntries.filters.projectAll")}</option>
              {projects.map((project: Project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-text" htmlFor="from">
              {t("admin.timeEntries.filters.fromLabel")}
            </label>
            <Input
              id="from"
              type="date"
              value={filters.from}
              onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text" htmlFor="to">
              {t("admin.timeEntries.filters.toLabel")}
            </label>
            <Input
              id="to"
              type="date"
              value={filters.to}
              onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-text">{t("admin.timeEntries.activeTimers.title")}</h2>
            <p className="text-sm text-primary/70">{t("admin.timeEntries.activeTimers.description")}</p>
          </div>
          <Button variant="outline" size="sm" type="button" onClick={() => void refetchTimers()}>
            {t("admin.timeEntries.actions.refresh")}
          </Button>
        </div>
        {timerActionError && (
          <div className="mb-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
            {timerActionError}
          </div>
        )}
        {isLoadingTimers ? (
          <p className="text-sm text-primary/70">{t("admin.timeEntries.activeTimers.loading")}</p>
        ) : activeTimers.length === 0 ? (
          <p className="text-sm text-primary/70">{t("admin.timeEntries.activeTimers.empty")}</p>
        ) : (
          <div className="space-y-3">
            {activeTimers.map((timer) => (
              <div
                key={timer.id}
                className="flex flex-col gap-3 rounded-lg border border-primary/15 bg-white/60 px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-text">{timer.project_name}</p>
                  <p className="text-xs text-primary/70">{timer.user_email}</p>
                  <p className="text-xs text-primary/60">
                    {t("admin.timeEntries.activeTimers.startedAt", {
                      datetime: new Date(timer.started_at).toLocaleString(locale)
                    })}
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs uppercase tracking-wide text-primary/60">
                    {t("admin.timeEntries.activeTimers.elapsedLabel")}
                  </p>
                  <p className="text-xl font-semibold text-text">{formatDuration(timer.elapsedSeconds)}</p>
                  <p className="text-xs text-primary/70">
                    {t("admin.timeEntries.activeTimers.statusLabel", {
                      status:
                        timer.status === "running"
                          ? t("admin.timeEntries.activeTimers.statuses.running")
                          : t("admin.timeEntries.activeTimers.statuses.paused")
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  {timer.status === "running" ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePause(timer)}
                      disabled={pauseTimerMutation.isPending && pauseTimerMutation.variables === timer.id}
                    >
                      {t("admin.timeEntries.actions.pause")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleResume(timer)}
                      disabled={
                        resumeTimerMutation.isPending && resumeTimerMutation.variables === timer.id
                      }
                    >
                      {t("admin.timeEntries.actions.resume")}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => openStopModal(timer)}
                  >
                    {t("admin.timeEntries.actions.stop")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <TimeEntriesTable
          entries={entries}
          isLoading={isLoadingEntries}
          locale={locale}
          onSelectEntry={setSelectedEntry}
        />
      </Card>
      <TimeEntryDetailDialog
        entry={selectedEntry}
        isOpen={selectedEntry !== null}
        locale={locale}
        onClose={() => setSelectedEntry(null)}
      />


      {isStartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <Card className="w-full max-w-xl p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-text">{t("admin.timeEntries.startModal.title")}</h2>
                <p className="text-sm text-primary/70">{t("admin.timeEntries.startModal.description")}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsStartModalOpen(false);
                  setStartError(null);
                  setStartForm({ projectId: "", notes: "" });
                }}
                disabled={createTimerMutation.isPending}
              >
                {t("common.actions.close")}
              </Button>
            </div>

            {startError && (
              <div className="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                {startError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleStartTimerSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text" htmlFor="start-project">
                  {t("admin.timeEntries.startModal.projectLabel")}
                </label>
                <select
                  id="start-project"
                  className="w-full rounded-lg border border-primary/25 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={startForm.projectId}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    setStartForm((prev) => ({ ...prev, projectId: event.target.value }))
                  }
                  disabled={isLoadingProjects || createTimerMutation.isPending}
                >
                  <option value="">{t("admin.timeEntries.startModal.projectPlaceholder")}</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text" htmlFor="start-notes">
                  {t("admin.timeEntries.startModal.notesLabel")}
                </label>
                <textarea
                  id="start-notes"
                  className="h-24 w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={startForm.notes}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setStartForm((prev) => ({ ...prev, notes: event.target.value }))
                  }
                  placeholder={t("admin.timeEntries.startModal.notesPlaceholder")}
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsStartModalOpen(false);
                    setStartError(null);
                    setStartForm({ projectId: "", notes: "" });
                  }}
                  disabled={createTimerMutation.isPending}
                >
                  {t("common.actions.cancel")}
                </Button>
                <Button type="submit" disabled={createTimerMutation.isPending || isTimersMutationPending}>
                  {createTimerMutation.isPending
                    ? t("admin.timeEntries.startModal.submitting")
                    : t("admin.timeEntries.startModal.submit")}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {stopModalTimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <Card className="w-full max-w-2xl p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-text">{t("admin.timeEntries.stopModal.title")}</h2>
                <p className="text-sm text-primary/70">{t("admin.timeEntries.stopModal.description")}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStopModalTimer(null)}
                disabled={stopTimerMutation.isPending}
              >
                {t("common.actions.close")}
              </Button>
            </div>

            {stopError && (
              <div className="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                {stopError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleStopSubmit}>
              <div>
                <p className="text-sm font-medium text-text">{stopModalTimer.project_name}</p>
                <p className="text-xs text-primary/70">
                  {t("admin.timeEntries.stopModal.totalTime", {
                    duration: formatDuration(getElapsedSeconds(stopModalTimer, tick))
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text" htmlFor="stop-summary">
                  {t("admin.timeEntries.stopModal.summaryLabel")}
                </label>
                <textarea
                  id="stop-summary"
                  className="h-32 w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={stopForm.summary}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setStopForm((prev) => ({ ...prev, summary: event.target.value }))
                  }
                  placeholder={t("admin.timeEntries.stopModal.summaryPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text" htmlFor="stop-task">
                  {t("admin.timeEntries.stopModal.taskLabel")}
                </label>
                <Input
                  id="stop-task"
                  value={stopForm.task}
                  onChange={(event) =>
                    setStopForm((prev) => ({ ...prev, task: event.target.value }))
                  }
                  placeholder={t("admin.timeEntries.stopModal.taskPlaceholder")}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-text">
                <input
                  type="checkbox"
                  checked={stopForm.billable}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setStopForm((prev) => ({ ...prev, billable: event.target.checked }))
                  }
                />
                {t("admin.timeEntries.stopModal.billableToggle")}
              </label>

              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStopModalTimer(null)}
                  disabled={stopTimerMutation.isPending}
                >
                  {t("common.actions.cancel")}
                </Button>
                <Button type="submit" disabled={stopTimerMutation.isPending}>
                  {stopTimerMutation.isPending
                    ? t("admin.timeEntries.stopModal.submitting")
                    : t("admin.timeEntries.stopModal.submit")}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

