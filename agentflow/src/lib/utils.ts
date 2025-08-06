import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Minimal JWT validation for Edge runtime.
 * Checks token structure and expiry, but does NOT verify signature.
 */
export function validateToken(token: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    // Check expiry
    if (payload.exp && typeof payload.exp === "number") {
      return Date.now() / 1000 < payload.exp;
    }
    // If no exp, treat as valid
    return true;
  } catch (e) {
    return false;
  }
}
