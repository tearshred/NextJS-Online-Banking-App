"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  Spacer,
  CircularProgress,
} from "@nextui-org/react";
import { resetPassword } from "@/app/actions/users/resetPassword";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await resetPassword(email, window.location.origin);
      setStatus({
        type: 'success',
        message: 'Password reset instructions have been sent to your email. The link will expire in 24 hours.'
      });
      setEmail('');
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'No account found with this email address.'
      });
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="p-6 w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          <p className="text-tiny uppercase tracking-wide text-gray-600">Password Recovery</p>
          <h4 className="font-bold text-2xl mt-2">Forgot Password</h4>
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
                isClearable
                onClear={() => setEmail("")}
                label="Email Address"
                labelPlacement="inside"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
                validationState={
                  email === '' ? "valid" : 
                  validateEmail(email) ? "valid" : "invalid"
                }
                errorMessage={
                  email && !validateEmail(email) 
                    ? "Please enter a valid email address"
                    : status.type === 'error' 
                      ? status.message 
                      : undefined
                }
                classNames={{
                  errorMessage: "text-black font-medium",
                  input: "text-medium",
                  label: "text-medium font-medium"
                }}
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
              <div className="text-center">
                <a 
                  className="text-primary hover:text-primary-600 transition-colors font-medium" 
                  href="/auth/login"
                >
                  Back to Login
                </a>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ForgotPassword;