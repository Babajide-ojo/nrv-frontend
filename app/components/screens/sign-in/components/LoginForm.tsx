import React, { useState } from "react";
import InputField from "@/app/components/shared/input-fields/InputFields";
import { LoginFormData, LoginFormErrors } from "../types";

interface LoginFormProps {
  formData: LoginFormData;
  errors: LoginFormErrors;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  errors,
  isLoading,
  onInputChange,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Field */}
      <div>
        <InputField
          label="Email Address"
          inputType="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          error={errors.email}
          placeholder="Enter your email address"
          required
        />
      </div>

      {/* Password Field */}
      <div>
        <InputField
          label="Password"
          inputType={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={onInputChange}
          error={errors.password}
          password={true}
          startIcon="/images/password-icon.svg"
          placeholder="Enter your password"
          required
        />
      </div>
    </form>
  );
};

export default LoginForm; 