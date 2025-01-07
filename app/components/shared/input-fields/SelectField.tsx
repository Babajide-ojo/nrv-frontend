import React, { ChangeEvent } from "react";
import Select, { GroupBase } from "react-select";
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
  options?: any;
  onChange?: any;
  value: any;
  disabled?: boolean;
  setValue?: any;
  onBlur?: any;
}

const _options: Option[] = [];

const formatOptionLabel = ({
  label,
  isSelected,
}: {
  label: string;
  isSelected: boolean;
}) => (
  <div className="flex">
    <div style={{ display: isSelected ? "none" : "block" }}>{label}</div>
  </div>
);

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    height: "37px",
    borderColor: state.isFocused ? "#d7d9db" : "#d7d9db",
    border: "0px",
    boxShadow: state.isFocused ? "none" : "none",
    backgroundColor: "transparent",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "400",
    colors: "#7d7d7d",
  }),

  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f5f5f5" : "white",
    color: state.isFocused ? "" : "#000000",
    borderRadius: "5px",
    margin: "5px",
    cursor: "pointer",
    colors: "#7d7d7d",
  }),

  placeholder: (provided: any) => ({
    ...provided,
    color: "#999999",
   // fontWeight: "400",
    fontSize: "13px",
    padding: "Opx",
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
    <div className="border border-[#a9b0ba] p-3 bg-white rounded-md">
      <label className="block text-[10px] md:text-sm font-medium  w-full text-nrvGreyBlack">
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
