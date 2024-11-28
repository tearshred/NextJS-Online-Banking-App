"use client";

import { Button, Card, CardBody, CardHeader, Input, Spacer, CircularProgress } from "@nextui-org/react";
import usePasswordResetForm from "@/components/auth/hooks/usePasswordResetForm";
import PasswordResetSuccess from "./PasswordResetSuccess";

interface PasswordResetFormProps {
  token: string;
}

export default function PasswordResetForm({ token }: PasswordResetFormProps) {
  const {
    passwords,
    setPasswords,
    isLoading,
    status,
    isSuccess,
    validatePassword,
    isFormValid,
    handleSubmit,
  } = usePasswordResetForm(token);

  if (isSuccess) {
    return <PasswordResetSuccess />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="p-6 w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          <p className="text-tiny uppercase tracking-wide text-gray-600">Set New Password</p>
          <h4 className="font-bold text-2xl mt-2">Reset Password</h4>
        </CardHeader>
        <CardBody className="px-6">
          {status.type === 'success' ? (
            <PasswordResetSuccess />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                isRequired
                type="password"
                variant="bordered"
                placeholder="New Password"
                labelPlacement="inside"
                description="Password must contain at least one uppercase letter, one lowercase letter, and one number"
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
                variant="bordered"
                placeholder="Confirm Password"
                labelPlacement="inside"
                description="Confirm Password"
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
                  isDisabled={isLoading || !isFormValid()}
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
