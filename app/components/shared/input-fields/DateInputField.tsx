"use client";

import { useState } from "react";
import { format, isValid } from "date-fns";
import { Calendar } from "lucide-react";
import InputField from "./InputFields";
import SelectDate from "../SelectDate";

export interface DateInputFieldProps {
  label?: string;
  name: string;
  value?: Date | string | null;
  onChange: (date: Date) => void;
  error?: string | null;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
  openTo?: "year" | "month" | "day";
  variant?: "flat" | "nested";
  displayFormat?: string;
}

const DateInputField = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder = "Select date",
  disabled = false,
  required = false,
  disablePast = false,
  disableFuture = false,
  openTo = "day",
  variant = "nested",
  displayFormat = "dd MMM yyyy",
}: DateInputFieldProps) => {
  const [open, setOpen] = useState(false);

  const displayValue =
    value && isValid(new Date(value)) ? format(new Date(value), displayFormat) : "";

  const handleOpen = () => {
    if (disabled) {
      return;
    }
    setOpen(true);
  };

  const handleDateChange = (date: Date) => {
    onChange(date);
    setOpen(false);
  };

  return (
    <div className="w-full">
      <InputField
        label={label}
        name={name}
        variant={variant}
        placeholder={placeholder}
        value={displayValue}
        readOnly
        disabled={disabled}
        required={required}
        error={error}
        onClick={handleOpen}
        onChange={() => {}}
        icon={<Calendar className="h-4 w-4 text-nrvPrimaryGreen" />}
        css={disabled ? "" : "cursor-pointer [&_input]:cursor-pointer"}
      />
      <SelectDate
        isOpen={open}
        onClose={() => setOpen(false)}
        value={value}
        onChange={handleDateChange}
        disablePast={disablePast}
        disableFuture={disableFuture}
        openTo={openTo}
      />
    </div>
  );
};

export default DateInputField;
