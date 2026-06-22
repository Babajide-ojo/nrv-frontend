"use client";

"use client";

import { useField } from "formik";
import DateInputField from "./DateInputField";

interface DatePickerFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  disablePast?: boolean;
  disableFuture?: boolean;
  openTo?: "year" | "month" | "day";
  onChange?: (isoDate: string) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  name,
  label,
  placeholder = "DD-MM-YYYY",
  disablePast = false,
  disableFuture = false,
  openTo = "day",
  onChange,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <DateInputField
      name={name}
      label={label}
      placeholder={placeholder}
      value={field.value}
      disablePast={disablePast}
      disableFuture={disableFuture}
      openTo={openTo}
      displayFormat="dd-MM-yyyy"
      error={meta.touched && meta.error ? String(meta.error) : null}
      onChange={(date) => {
        const iso = date.toISOString();
        helpers.setValue(iso);
        helpers.setTouched(true);
        if (onChange) {
          onChange(iso);
        }
      }}
    />
  );
};

export default DatePickerField;
