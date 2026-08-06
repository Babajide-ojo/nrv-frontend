import React from "react";
import { FaCircleNotch } from "react-icons/fa6";

type SpinnerProps = {
  size?: number;
  className?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ size = 20, className = "" }) => {
  return (
    <FaCircleNotch
      className={`animate-spin ${className}`}
      aria-label="Loading"
      size={size}
    />
  );
};

export default Spinner;

