"use client";

import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Input, Spacer, CircularProgress } from "@nextui-org/react";
import { resetPassword } from "@/app/actions/users/resetPassword";

interface PasswordResetFormProps {
  token: string;
}

export default function PasswordResetForm({ token }: PasswordResetFormProps) {
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasMinLength) return "Password must be at least 8 characters";
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
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
      const result = await resetPassword(token, passwords.password);

      setStatus({
        type: 'success',
        message: 'Password has been successfully reset'
      });
      setPasswords({ password: '', confirmPassword: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to reset password. The link may have expired.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="p-6 w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          <p className="text-tiny uppercase tracking-wide text-gray-600">Set New Password</p>
          <h4 className="font-bold text-2xl mt-2">Reset Password</h4>
        </CardHeader>
        <CardBody className="px-6">
          {status.type === 'success' ? (
            <div className="text-center py-4">
              <p className="text-success font-medium">{status.message}</p>
              <Spacer y={4} />
              <a 
                className="text-primary hover:text-primary-600 transition-colors font-medium" 
                href="/auth/login"
              >
                Back to Login
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                isRequired
                type="password"
                label="New Password"
                labelPlacement="inside"
                value={passwords.password}
                onChange={(e) => setPasswords(prev => ({ ...prev, password: e.target.value }))}
                classNames={{
                  errorMessage: "text-black font-medium",
                  input: "text-medium",
                  label: "text-medium font-medium"
                }}
                validationState={
                  passwords.password === '' ? "valid" : 
                  validatePassword(passwords.password) ? "invalid" : "valid"
                }
                errorMessage={validatePassword(passwords.password)}
              />
              <Input
                isRequired
                type="password"
                label="Confirm Password"
                labelPlacement="inside"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                classNames={{
                  errorMessage: "text-black font-medium",
                  input: "text-medium",
                  label: "text-medium font-medium"
                }}
                validationState={
                  passwords.confirmPassword === '' ? "valid" :
                  passwords.password !== passwords.confirmPassword ? "invalid" : "valid"
                }
                errorMessage={
                  passwords.confirmPassword && 
                  passwords.password !== passwords.confirmPassword ? 
                  "Passwords do not match" : undefined
                }
              />
              <div className="flex justify-center">
                <Button
                  className="w-full font-medium"
                  color="primary"
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size="sm" aria-label="Loading..." />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
