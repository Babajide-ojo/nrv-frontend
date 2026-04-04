/** Remaining credits = balance minus used (per tier). */
export function getVerificationCreditBalances(u: unknown): {
  standard: number;
  premium: number;
} {
  const x = u as Record<string, unknown> | null | undefined;
  if (!x) return { standard: 0, premium: 0 };
  const standard = Math.max(
    0,
    (Number(x.standardVerificationBalance) || 0) -
      (Number(x.standardVerificationUsed) || 0),
  );
  const premium = Math.max(
    0,
    (Number(x.premiumVerificationBalance) || 0) -
      (Number(x.premiumVerificationUsed) || 0),
  );
  return { standard, premium };
}
