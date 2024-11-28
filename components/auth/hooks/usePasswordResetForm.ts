import { useState } from "react";
import { resetPassword } from "@/app/actions/users/resetPassword";

const usePasswordResetForm = (token: string) => {
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return "";
  };

  const isFormValid = () => {
    return (
      passwords.password.length > 0 &&
      passwords.confirmPassword.length > 0 &&
      !validatePassword(passwords.password) &&
      passwords.password === passwords.confirmPassword
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) return;

    setIsLoading(true);
    try {
      await resetPassword(token, passwords.password);
      setStatus({
        type: 'success',
        message: 'Password has been successfully reset'
      });
      setIsSuccess(true);
      setPasswords({ password: '', confirmPassword: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to reset password. The link may have expired.'
      });
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    passwords,
    setPasswords,
    isLoading,
    status,
    isSuccess,
    validatePassword,
    isFormValid,
    handleSubmit,
  };
};

export default usePasswordResetForm;
