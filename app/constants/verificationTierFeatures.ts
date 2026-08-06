export const STANDARD_VERIFICATION_FEATURES = [
  "NIN identity verification",
  "Name and date-of-birth alignment",
  "Government ID document check",
  "Phone fraud screening",
  "Utility bill / address verification",
  "AML, PEP & sanctions screening",
  "Employment & guarantor review",
  "Landlord-ready trust report",
] as const;

export const PREMIUM_VERIFICATION_FEATURES = [
  ...STANDARD_VERIFICATION_FEATURES,
  "Credit bureau affordability check (BVN)",
  "Debt-to-income assessment",
  "Salary proof manual review",
  "Enhanced financial capacity scoring",
] as const;

export const PREMIUM_ONLY_FEATURES = PREMIUM_VERIFICATION_FEATURES.slice(
  STANDARD_VERIFICATION_FEATURES.length,
);
