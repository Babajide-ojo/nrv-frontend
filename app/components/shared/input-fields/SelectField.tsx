import React from "react";
import Select from "react-select";

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
  options?: Option[];
  onChange?: (selectedOption: any) => void;
  value: any;
  disabled?: boolean;
  onBlur?: any;
}

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderColor: "#E0E0E6", // Grey border always
    borderWidth: "0px",
    boxShadow: "none", // Remove blue border on focus
    backgroundColor: "transparent",
    borderRadius: "5px",
    fontSize: "15px",
    fontWeight: 400,
    color: "#807F94",
    padding: "2px",
    height: "48px",
  }),

  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f5f5f5" : "white",
    color: "#807F94",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  }),

  placeholder: (provided: any) => ({
    ...provided,
    color: "#807F94",
    fontWeight: 300,
  }),

  singleValue: (provided: any) => ({
    ...provided,
    color: "#333333",
  }),

  input: (provided: any) => ({
    ...provided,
    color: "#333333",
    fontWeight: 300,
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
}) => {
  const handleSelectChange = (selectedOption: any) => {
    if (onChange) {
      onChange(selectedOption);
    }
  };

  return (
    <div>
    <label htmlFor={name} className="flex gap-1 items-center w-full">
        <span className="text-[#807F94] text-[14px] font-medium">{label}</span>
        {required && <span className="text-red-600">*</span>}
      </label>
      <div className="border border-gray-300 rounded-lg pl-1.5 mt-2">
        <Select
          name={name}
          isDisabled={disabled}
          styles={customStyles}
          isSearchable={isSearchable}
          isClearable={true}
          options={options}
          placeholder={placeholder}
          value={value}
          noOptionsMessage={noOptionsMessage}
          onChange={handleSelectChange}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
};

export default SelectField;
