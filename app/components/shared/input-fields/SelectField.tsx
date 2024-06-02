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
}

const _options: Option[] = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const formatOptionLabel = ({ label, isSelected }: { label: string; isSelected: boolean }) => (
  <div className="flex">
    <div style={{ display: isSelected ? "none" : "block" }}>{label}</div>
  </div>
);

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    height: "43px",
    borderColor: state.isFocused
      ? "#999999"
      : "#999999",
    boxShadow: state.isFocused ? "none" : "none",
    backgroundColor: "#EEF0F2",
    borderRadius: "10px",
    fontSize: "15px",
    colors: "#EEF0F2"

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
      <label className="block text-gray-700 text-sm mb-2">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <Select
      //  setValue={setValue}
        name={name}
        isDisabled={disabled}
        styles={customStyles}
        isSearchable={isSearchable}
        options={options || _options}
        placeholder={placeholder}
        value={value}
        noOptionsMessage={noOptionsMessage}
        formatOptionLabel={formatOptionLabel}
        onChange={handleSelectChange}
      />
    </div>
  );
};

export default SelectField;
