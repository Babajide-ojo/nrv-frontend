import type { KeyboardEvent } from "react";

export const POSITIVE_RENT_INPUT_PATTERN = /^\d*\.?\d{0,}$/;

/**
 * Strip commas/signs/letters so rent amount can never hold a negative value.
 * Always returns a string safe to store in controlled inputs.
 */
export const sanitizePositiveRentInput = (value: string): string => {
  let cleaned = String(value ?? "")
    .replace(/,/g, "")
    .replace(/[^\d.]/g, "");

  const firstDot = cleaned.indexOf(".");
  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) +
      cleaned.slice(firstDot + 1).replace(/\./g, "");
  }

  return cleaned;
};

export const blockNonPositiveRentKeys = (
  event: KeyboardEvent<HTMLInputElement>,
) => {
  if (
    event.key === "-" ||
    event.key === "+" ||
    event.key === "e" ||
    event.key === "E" ||
    event.key === "Minus" ||
    event.code === "Minus" ||
    event.code === "NumpadSubtract"
  ) {
    event.preventDefault();
  }
};

export const parsePositiveRentAmount = (value: unknown): number | null => {
  if (value == null || value === "") {
    return null;
  }
  const raw = sanitizePositiveRentInput(String(value)).trim();
  if (!raw || !POSITIVE_RENT_INPUT_PATTERN.test(raw)) {
    return null;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

export const isValidPositiveRentAmount = (value: unknown): boolean =>
  parsePositiveRentAmount(value) != null;
