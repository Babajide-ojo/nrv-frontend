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
  styles?: any
}

const FormikSelectField: React.FC<FormikSelectFieldProps | any> = ({
  name,
  label,
  required,
  placeholder,
  isSearchable,
  noOptionsMessage,
  options,
  disabled,
  styles
}) => {
  const { values, setFieldValue, setFieldTouched, errors, touched } = useFormikContext<any>();

  const handleChange = (selectedOption: Option | any) => {
    setFieldValue(name, selectedOption?.value);
  };

  const handleBlur = () => {
    setFieldTouched(name, true);
  };

  const value = values[name] || null;


  const customStyles: any = {
    control: (provided: any, state: any) => ({
      ...provided,
      height: "40px",
      borderColor: state.isFocused
        ? "your-custom-border-color"
        : provided.borderColor,
      boxShadow: state.isFocused ? "none" : provided.boxShadow,
      fontSize: "14px"
    }),
  
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#f5f5f5" : "white",
      color: state.isFocused ? "#000000" : "#000000",
      borderRadius: "5px",
      margin: "5px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
      fontSize:"14px"
    }),
  };

  return (
    <div className="w-full mt-4">
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
        //styles={customStyles}
        
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
