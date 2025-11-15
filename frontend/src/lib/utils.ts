import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const absoluteUrlPattern = /^https?:\/\//i;

function getMediaBaseUrl(): string | null {
  if (typeof import.meta !== "undefined") {
    const meta = import.meta as unknown as {
      env?: Record<string, string | undefined> & { DEV?: boolean };
    };
    const envBase = meta.env?.VITE_MEDIA_BASE_URL ?? meta.env?.VITE_BACKEND_URL;
    if (envBase) {
      return envBase.replace(/\/$/, "");
    }
    if (meta.env?.DEV && meta.env?.VITE_DEV_MEDIA_BASE_URL) {
      return meta.env.VITE_DEV_MEDIA_BASE_URL.replace(/\/$/, "");
    }
  }

  if (typeof window !== "undefined") {
    const globalBase = (window as unknown as { __WORKTRACE_MEDIA_BASE_URL?: string }).__WORKTRACE_MEDIA_BASE_URL;
    if (globalBase) {
      return globalBase.replace(/\/$/, "");
    }
    return window.location.origin.replace(/\/$/, "");
  }

  return null;
}

export function resolveMediaUrl(path?: string | null): string | null {
  if (!path) {
    return null;
  }

  if (absoluteUrlPattern.test(path)) {
    return path;
  }

  if (path.startsWith("//")) {
    if (typeof window !== "undefined") {
      return `${window.location.protocol}${path}`;
    }
    return `https:${path}`;
  }

  const base = getMediaBaseUrl();
  if (!base) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${base}${path}`;
  }

  return `${base}/${path}`;
}


