import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const textLength = content.split(/\s+/).length;
  if (textLength <= 0) return 1;
  const readingTime = Math.ceil(textLength / wordsPerMinute);
  return readingTime > 0 ? readingTime : 1;
}

export function formatViewCount(count: number): string {
  if (!count && count !== 0) return "0 views";

  if (count === 1) return "1 view";

  if (count < 1000) return `${count} views`;

  const formatted = (count / 1000).toFixed(1);

  const display = formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted;
  return `${display}k views`;
}
