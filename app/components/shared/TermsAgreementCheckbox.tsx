"use client";

import Link from "next/link";

type TermsAgreementCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  label?: string;
};

const TermsAgreementCheckbox = ({
  checked,
  onChange,
  id = "terms-agreement",
  label = "I agree to the terms and conditions",
}: TermsAgreementCheckboxProps) => {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[#57534E]"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#D6D3D1] accent-nrvPrimaryGreen focus:ring-nrvPrimaryGreen focus:ring-offset-0"
      />
      <span>
        {label}{" "}
        <Link
          href="/legal/terms"
          className="font-medium text-nrvPrimaryGreen underline-offset-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of Service
        </Link>
        {" and "}
        <Link
          href="/legal/privacy"
          className="font-medium text-nrvPrimaryGreen underline-offset-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </Link>
        .
      </span>
    </label>
  );
};

export default TermsAgreementCheckbox;
