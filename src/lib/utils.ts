import dayjs from "dayjs";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string, includeTime = true) {
  if (!dateString) return "";

  return dayjs(dateString).format(
    includeTime ? "MM/DD/YYYY hh:mm A" : "MM/DD/YYYY",
  );
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}
