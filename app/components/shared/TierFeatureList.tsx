"use client";

import { Check } from "lucide-react";
import {
  PREMIUM_ONLY_FEATURES,
  STANDARD_VERIFICATION_FEATURES,
} from "@/app/constants/verificationTierFeatures";

type TierFeatureListProps = {
  tier: "standard" | "premium";
  /** When premium, show only the add-on features (not the full standard list again). */
  premiumAddonsOnly?: boolean;
  className?: string;
};

const TierFeatureList = ({
  tier,
  premiumAddonsOnly = false,
  className = "",
}: TierFeatureListProps) => {
  const items =
    tier === "premium" && premiumAddonsOnly
      ? PREMIUM_ONLY_FEATURES
      : tier === "premium"
        ? [...STANDARD_VERIFICATION_FEATURES, ...PREMIUM_ONLY_FEATURES]
        : STANDARD_VERIFICATION_FEATURES;

  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((feature) => (
        <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
          <Check
            className="mt-0.5 h-4 w-4 shrink-0 text-[#03442C]"
            aria-hidden
          />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
};

export default TierFeatureList;
