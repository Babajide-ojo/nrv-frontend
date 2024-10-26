import React, { ChangeEvent } from "react";
import Select,  { GroupBase } from "react-select";
import { colors } from "react-select/dist/declarations/src/theme";

interface Option {
  value: any;
  label: string;
}

interface Props {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  isSearchable?: boolean;
  noOptionsMessage?: () => string;
  options?: any
  onChange?: any;
  value: any;
  disabled?: boolean;
  setValue?: any;
  onBlur?: any
}

const _options: Option[] = [

];

const formatOptionLabel = ({ label, isSelected }: { label: string; isSelected: boolean }) => (
  <div className="flex">
    <div style={{ display: isSelected ? "none" : "block" }}>{label}</div>
  </div>
);

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    height: "42.5px",
    borderColor: state.isFocused
      ? "#d7d9db"
      : "#d7d9db",
    boxShadow: state.isFocused ? "none" : "none",
    backgroundColor: "transparent",
    borderRadius: "10px",
    fontSize: "12px",
    colors: "#6B6C6C",

  }),

  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f5f5f5" : "white",
    color: state.isFocused ? "" : "#000000",
    borderRadius: "5px",
    margin: "5px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
        fontSize: "12px",
    colors: "#000000",
 
  }),

  placeholder: (provided: any) => ({
    ...provided,
    color: "#9da3af", // Set placeholder color to red
    fontWeight: "300"
  }),
};

const SelectField: React.FC<Props> = ({
  label,
  name,
  required,
  placeholder,
  isSearchable,
  noOptionsMessage,
  options,
  onChange,
  onBlur,
  value,
  disabled,
  setValue,
}) => {
  const handleSelectChange = (selectedOption: any) => {
    if (onChange) {
      onChange(selectedOption);
    }
  };

  return (
    <div>
      <label className="block text-nrvGreyBlack text-sm mb-3">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <Select
      //  setValue={setValue}
        name={name}
        isDisabled={disabled}
        styles={customStyles}
        isSearchable={true}
        isClearable={true}
        options={options || _options}
        placeholder={placeholder}
        value={value}
        noOptionsMessage={noOptionsMessage}
        formatOptionLabel={formatOptionLabel}
        onChange={handleSelectChange || onChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default SelectField;
