import React from "react";
import { useFormikContext, ErrorMessage } from "formik";
import SelectField from "./SelectField";

interface Option {
  value: any;
  label: string;
}

interface FormikSelectFieldProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  isSearchable?: boolean;
  noOptionsMessage?: () => string;
  options: Option[];
  disabled?: boolean;

}

const FormikSelectField: React.FC<FormikSelectFieldProps> = ({
  name,
  label,
  required,
  placeholder,
  isSearchable,
  noOptionsMessage,
  options,
  disabled,
}) => {
  const { values, setFieldValue, setFieldTouched, errors, touched } = useFormikContext<any>();

  const handleChange = (selectedOption: Option | any) => {
    setFieldValue(name, selectedOption.value);
  };

  const handleBlur = () => {
    setFieldTouched(name, true);
  };

  const value = values[name] || null;

  return (
    <div className="w-full mt-8">
      <SelectField
        name={name}
        label={label}
        required={required}
        placeholder={placeholder}
        isSearchable={isSearchable}
        noOptionsMessage={noOptionsMessage}
        options={options}
        value={value?.label}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-xs"
      />
    </div>
  );
};

export default FormikSelectField;
