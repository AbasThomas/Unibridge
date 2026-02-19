import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "h:mm a");
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy 'at' h:mm a");
}

export function timeAgo(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getResourceTypeColor(type: string): string {
  const colors: Record<string, string> = {
    notes: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "past-questions": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "study-guide": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    textbook: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    assignment: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
}

export function getOpportunityTypeColor(type: string): string {
  const colors: Record<string, string> = {
    scholarship: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    bursary: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    gig: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    internship: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    grant: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
