export const sanitizePositiveRentInput = (value: string): string => {
  const cleaned = value.replace(/,/g, "").replace(/[^\d.]/g, "");
  if (cleaned === "" || /^\d*\.?\d{0,}$/.test(cleaned)) {
    return cleaned;
  }
  return "";
};

export const parsePositiveRentAmount = (value: unknown): number | null => {
  if (value == null || value === "") {
    return null;
  }
  const parsed = Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

export const isValidPositiveRentAmount = (value: unknown): boolean =>
  parsePositiveRentAmount(value) != null;
