import React, { useEffect, useRef, useState } from "react";

interface ReusableSelectProps {
  isOpen?: boolean;
  searchable?: boolean;
  searchValue?: string;
  onClose?: (state: boolean) => void;
  placeholder?: string;
  format?: any[];
  optionValue?: any[];
  setValue?: (val: any) => void;
}

const ReusableSelect: React.FC<ReusableSelectProps> = ({
  isOpen,
  searchable,
  searchValue,
  onClose,
  placeholder,
  format,
  optionValue,
  setValue,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose && onClose(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filter = format?.filter((item) => {
    const value = item?.value;
    if (typeof value !== "object" || value === null) {
      return false;
    }

    return Object.keys(value).some((key) => {
      const fieldValue = value[key];
      return (
        typeof fieldValue === "string" &&
        fieldValue.toLowerCase().includes(searchTerm?.toLowerCase())
      );
    });
  });

  useEffect(() => {
    if (searchValue) {
      setSearchTerm(searchValue);
    }
  }, [searchValue]);

  // Return null if isOpen is false instead of undefined
  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className={`absolute z-[30] bg-white top-full left-0 w-full mt-1 overflow-hidden border-swGray100 rounded-2xl ${
        searchable === false ? "" : "p-5 border"
      }`}
    >
      <div
        className={`${
          searchable === false && "hidden"
        } rounded-lg border border-swGray100 flex gap-1 items-center pl-4 overflow-hidden mb-2`}
      >
        <input
          type="text"
           value={searchTerm}
          placeholder={placeholder || "Search"}
          className="p-2 w-full focus:outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={`p-5 w-full max-h-96 overflow-y-scroll hide-scrollbar border border-swGray100 rounded-2xl`}>
        {filter && filter.length > 0 ? (
          filter.map((item, i) => (
            <div
              key={i}
              onClick={() => {
                setValue && setValue(item?.value);
                onClose && onClose(false);
              }}
              className={`${"border-y"}`}
            >
              {item?.label}
            </div>
          ))
        ) : optionValue && optionValue.length > 0 ? (
          optionValue.map((item, i) => (
            <div
              key={i}
              onClick={() => {
                setValue && setValue(item?.value);
                onClose && onClose(false);
              }}
              className={`${i !== 0 && "border-t"}`}
            >
              {item?.label}
            </div>
          ))
        ) : (
          <div className="text-center">No options found</div>
        )}
      </div>
    </div>
  );
};

export default ReusableSelect;
