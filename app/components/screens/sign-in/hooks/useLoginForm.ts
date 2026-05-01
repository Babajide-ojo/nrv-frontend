import { useState, useCallback } from "react";
import { LoginFormData, LoginFormErrors } from "../types";
import { VALIDATION_MESSAGES } from "../constants";

export const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: LoginFormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
    } else if (formData.password.length < 6) {
      newErrors.password = VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({ 
      ...prevData, 
      [name]: value 
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prevErrors) => ({ 
        ...prevErrors, 
        [name]: undefined 
      }));
    }
  }, [errors]);

  const resetForm = useCallback(() => {
    setFormData({
      email: "",
      password: "",
    });
    setErrors({});
  }, []);

  const setFormDataDirectly = useCallback((data: Partial<LoginFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  return {
    formData,
    errors,
    handleInputChange,
    validateForm,
    resetForm,
    setFormDataDirectly,
  };
}; 