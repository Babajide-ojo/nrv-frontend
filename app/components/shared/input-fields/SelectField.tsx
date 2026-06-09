import React from "react";
import Select from "react-select";

interface Option {
  value: any;
  label: string;
}

type SelectFieldVariant = "flat" | "nested";

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
  error?: any;
  variant?: SelectFieldVariant;
}

const buildCustomStyles = (variant: SelectFieldVariant) => ({
  control: (provided: any) => ({
    ...provided,
    borderColor: "transparent",
    borderWidth: "0px",
    boxShadow: "none",
    backgroundColor: "transparent",
    borderRadius: variant === "nested" ? "6px" : "5px",
    fontSize: "14px",
    fontWeight: 400,
    color: "#1E293B",
    padding: "0px",
    minHeight: variant === "nested" ? "44px" : "40px",
    cursor: "pointer",
  }),

  valueContainer: (provided: any) => ({
    ...provided,
    padding: "2px 8px",
  }),

  indicatorsContainer: (provided: any) => ({
    ...provided,
    paddingRight: "4px",
  }),

  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: "#E2E8F0",
    marginTop: 10,
    marginBottom: 10,
  }),

  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#F8FAFC" : "white",
    color: "#1E293B",
    cursor: "pointer",
    fontSize: "14px",
  }),

  placeholder: (provided: any) => ({
    ...provided,
    color: "#94A3B8",
    fontWeight: 400,
  }),

  singleValue: (provided: any) => ({
    ...provided,
    color: "#1E293B",
  }),

  input: (provided: any) => ({
    ...provided,
    color: "#1E293B",
    fontWeight: 400,
  }),

  menu: (provided: any) => ({
    ...provided,
    zIndex: 20,
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #E2E8F0",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
  }),
});

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
  error,
  variant = "flat",
}) => {
  const handleSelectChange = (selectedOption: any) => {
    if (onChange) {
      onChange(selectedOption);
    }
  };

  const selectControl = (
    <div
      className={
        variant === "nested"
          ? "rounded-md border border-[#E2E8F0] bg-white px-1"
          : "mt-1 rounded-lg border border-[#E2E8F0] bg-white pl-1.5"
      }
    >
      <Select
        name={name}
        isDisabled={disabled}
        styles={buildCustomStyles(variant)}
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
  );

  const labelNode = (
    <label htmlFor={name} className="mb-2 flex items-center gap-1">
      <span className="text-sm font-medium text-[#4A5568]">{label}</span>
      {required && <span className="text-red-500">*</span>}
    </label>
  );

  if (variant === "nested") {
    return (
      <div className="w-full">
        {labelNode}
        {selectControl}
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="w-full">
      {labelNode}
      {selectControl}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default SelectField;
