"use client";

import { useField } from "formik";
import DateInputField, { DateInputFieldProps } from "./DateInputField";

type FormikDateInputFieldProps = Omit<
  DateInputFieldProps,
  "value" | "onChange" | "error"
> & {
  name: string;
  error?: string | null;
};

const FormikDateInputField = ({
  name,
  error: errorProp,
  ...rest
}: FormikDateInputFieldProps) => {
  const [field, meta, helpers] = useField(name);

  const resolvedError =
    errorProp ?? (meta.touched && meta.error ? String(meta.error) : null);

  return (
    <DateInputField
      {...rest}
      name={name}
      value={field.value}
      error={resolvedError}
      onChange={(date) => {
        helpers.setValue(date);
        helpers.setTouched(true);
      }}
    />
  );
};

export default FormikDateInputField;
