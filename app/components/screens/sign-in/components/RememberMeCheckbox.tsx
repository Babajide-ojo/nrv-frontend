import React from "react";
import { FaCheck } from "react-icons/fa";

interface RememberMeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center mt-4">
      <button
        type="button"
        className={`w-5 h-5 flex items-center justify-center border rounded-md transition-all ${
          checked 
            ? "bg-[#03442C] border-[#03442C]" 
            : "border-gray-400 hover:border-gray-500"
        }`}
        onClick={() => onChange(!checked)}
        aria-label="Remember this device"
      >
        {checked && <FaCheck size={10} color="white" />}
      </button>
      <label 
        htmlFor="rememberMe" 
        className="ml-2 text-sm cursor-pointer select-none"
        onClick={() => onChange(!checked)}
      >
        Remember this Device
      </label>
    </div>
  );
};

export default RememberMeCheckbox; 