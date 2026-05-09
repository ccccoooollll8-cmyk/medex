import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, differenceInDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), "MMM dd, yyyy");
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    return format(parseISO(dateString), "MMM dd, yyyy HH:mm");
  } catch {
    return dateString;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function getDaysUntilExpiry(expiryDate: string): number {
  return differenceInDays(parseISO(expiryDate), new Date());
}

export function getExpiryStatus(expiryDate: string): "expired" | "critical" | "warning" | "ok" {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return "expired";
  if (days <= 30) return "critical";
  if (days <= 90) return "warning";
  return "ok";
}

export function generateSKU(category: string, name: string): string {
  const catCode = category.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 3);
  const nameCode = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 3);
  const num = Math.floor(Math.random() * 900) + 100;
  return `MX-${catCode}-${nameCode}-${num}`;
}

export function generateBatchNumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `BT-${year}-${num}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    supplier: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    distributor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    provider: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    admin: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };
  return colors[role] || "bg-gray-100 text-gray-700";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    low_stock: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    expired: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    recalled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    pending: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    dispatched: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    in_transit: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

export function getRiskColor(level: string): string {
  const colors: Record<string, string> = {
    critical: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400",
    high: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400",
    medium: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
    low: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
  };
  return colors[level] || "bg-gray-100 text-gray-700";
}

export function downloadCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
