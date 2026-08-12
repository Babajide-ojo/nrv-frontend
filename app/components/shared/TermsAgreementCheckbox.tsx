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
      className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#03442C] focus:ring-[#03442C]"
      />
      <span>
        {label}{" "}
        <Link
          href="/legal/terms"
          className="font-medium text-[#03442C] underline-offset-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of Service
        </Link>
        {" and "}
        <Link
          href="/legal/privacy"
          className="font-medium text-[#03442C] underline-offset-2 hover:underline"
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
