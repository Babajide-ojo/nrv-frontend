const VALID_LANDING_ACCESS_CODES = ["phlip2025", "nrvguest2026"];

export const isValidLandingAccessCode = (input: string): boolean => {
  const normalized = input.trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  return VALID_LANDING_ACCESS_CODES.includes(normalized);
};
