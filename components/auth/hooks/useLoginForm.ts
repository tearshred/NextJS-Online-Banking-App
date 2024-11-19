import { useState } from 'react';
import { LoginFormData, LoginFormErrors, validateLoginForm, validateUsername } from '../utils/validation';

interface UseLoginFormProps {
  handleLogin: (username: string, password: string) => Promise<{
    success: boolean;
    error?: {
      code: string;
      message: string;
    };
  }>;
}

export const useLoginForm = ({ handleLogin }: UseLoginFormProps) => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<LoginFormErrors>({
    username: false,
    password: false,
    general: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof LoginFormErrors, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset all states
    setErrors({
      username: false,
      password: false,
      general: false
    });
    
    const formErrors: LoginFormErrors = {
      username: false,
      password: false,
      general: false
    };
    
    // Validate on submit
    if (!formData.username) {
      formErrors.username = true;
    } else if (!validateUsername(formData.username)) {
      formErrors.username = true;
    }
    
    if (!formData.password) {
      formErrors.password = true;
    }

    if (Object.values(formErrors).some(error => error === true)) {
      setErrors(formErrors);
      console.log('Username error after validation:', formErrors.username);
      console.log('Password error after validation:', formErrors.password);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await handleLogin(formData.username, formData.password);
      
      if (!response.success && response.error) {
        switch (response.error.code) {
          case 'USER_NOT_FOUND':
            setErrors({ username: true, password: false, general: false });
            setFormData(prev => ({ ...prev, password: '' }));
            break;
          case 'INVALID_PASSWORD':
            setErrors({ password: true, username: false, general: false });
            setFormData(prev => ({ ...prev, password: '' }));
            break;
          default:
            setErrors({ username: false, password: false, general: response.error?.message || "Login failed" });
        }
      }
    } catch (error: any) {
      setErrors({ username: false, password: false, general: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit
  };
}; 