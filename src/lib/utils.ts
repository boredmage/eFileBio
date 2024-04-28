import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  return `${process.env.URI_REDIRECT}${path}`;
}

export function getFileSize(size: number) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    Number((size / Math.pow(1024, i)).toFixed(2)) * 1 +
    " " +
    ["B", "KB", "MB", "GB", "TB"][i]
  );
}

export const getDueDate = (businessCreatedDate: string) =>
  90 -
  (new Date(new Date().toLocaleDateString("en-US")).getTime() -
    new Date(businessCreatedDate).getTime()) /
    86_400_000;
