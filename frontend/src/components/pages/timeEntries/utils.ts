import type { TimeEntryTimer } from "@/lib/types";

export const formatDuration = (totalSeconds: number) => {
  const seconds = Math.max(totalSeconds, 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
};

export const getElapsedSeconds = (timer: TimeEntryTimer, reference: number) => {
  let elapsedSeconds = timer.accumulated_seconds;
  if (timer.status === "running" && timer.last_resumed_at) {
    const resumedAt = new Date(timer.last_resumed_at).getTime();
    const difference = Math.floor((reference - resumedAt) / 1000);
    elapsedSeconds += Math.max(difference, 0);
  }
  return elapsedSeconds;
};

