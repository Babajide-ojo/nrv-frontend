import React, { useState } from "react";
import { useField } from "formik";
import { format, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import FormikInputField from "./FormikInputField";
import SelectDate from "../SelectDate";

interface DatePickerFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  onChange?: (date: string) => void; // Allow external state updates
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  name,
  label,
  placeholder = "DD-MM-YYYY",
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [field, , helpers] = useField(name);

  const formattedDate =
    field.value && isValid(new Date(field.value))
      ? format(new Date(field.value), "dd-MM-yyyy")
      : "";

  const handleDateChange = (selectedDate: string) => {
    helpers.setValue(selectedDate); // Update Formik state
    if (onChange) onChange(selectedDate); // Call external function if provided
    setOpen(false);
  };

  return (
    <div className="w-full mb-8">
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        <FormikInputField
          name={name}
          value={formattedDate}
          onClick={() => setOpen(true)}
          placeholder={placeholder}
          icon={<CalendarIcon color="#7d7d7d" width={20} height={20} />}
          isDisabled={false}
          label={label}
        />
      </div>
      <SelectDate
        isOpen={open}
        onClose={() => setOpen(false)}
        value={field.value}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default DatePickerField;
