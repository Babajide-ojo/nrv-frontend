import React, { useState } from 'react';

interface ToggleSwitchProps {
  initialChecked?: boolean;
  onChange?: (checked: boolean) => void;
  title?: string;
  description?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  initialChecked = false,
  onChange,
  title,
  description,
}) => {
  const [checked, setChecked] = useState(initialChecked);

  const handleToggle = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
      <div
        onClick={handleToggle}
        className={`flex items-center cursor-pointer w-10 h-5 rounded-full transition-all ${
          checked ? 'bg-gray-400' : 'bg-gray-300'
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </div>
      <div className="flex flex-col">
        <p className="font-medium text-nrvDarkBlue text-md">{title}</p>
        <p className="font-light text-nrvLightGrey text-sm mt-1">{description}</p>
      </div>
    </div>
  );
};

export default ToggleSwitch;
