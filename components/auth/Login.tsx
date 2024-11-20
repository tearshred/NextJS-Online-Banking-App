"use client";

import React from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  Spacer,
  CircularProgress,
  Divider,
} from "@nextui-org/react";
import { useLoginForm } from "./hooks/useLoginForm";

interface LoginProps {
  handleLogin: (username: string, password: string) => Promise<{
    success: boolean;
    error?: {
      code: string;
      message: string;
    };
  }>;
}

const Login: React.FC<LoginProps> = ({ handleLogin }) => {
  const {
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit
  } = useLoginForm({ handleLogin });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-6 w-full max-w-md mx-auto">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          <p className="text-tiny">Welcome Back</p>
          <h4 className="font-bold text-large">Log In</h4>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="min-h-[70px]">
              <Input
                isRequired
                isClearable
                onClear={() => handleInputChange('username', '')}
                label="Username"
                labelPlacement="inside"
                description="Enter your username"
                type="text"
                value={formData.username}
                onValueChange={(value) => handleInputChange('username', value)}
                isInvalid={errors.username}
                errorMessage={errors.username ? "Invalid username" : undefined}
              />
            </div>
            <div className="min-h-[70px]">
              <Input
                isRequired
                label="Password"
                labelPlacement="inside"
                description="Enter your password"
                type="password"
                value={formData.password}
                onValueChange={(value) => handleInputChange('password', value)}
                isInvalid={errors.password}
                errorMessage={errors.password ? "Invalid password" : undefined}
              />
            </div>
            {errors.general && (
              <div className="text-danger text-sm text-center">
                {errors.general}
              </div>
            )}
            <Spacer y={1} />
            <div className="flex justify-center">
              <Button
                color="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size="sm" aria-label="Loading..." />
                ) : (
                  "Log In"
                )}
              </Button>
            </div>
            <div className="text-center mt-4">
              <a className="text-tiny" href="/auth/reset-request">Forgot Username/Password?</a>
              <Divider className="my-2"/>
              <a className="text-tiny" href="/auth/sign-up">
                Don't have an account? Sign up
              </a>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
