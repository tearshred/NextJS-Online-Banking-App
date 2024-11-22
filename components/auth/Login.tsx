"use client";

import React from "react";
import Image from "next/image";
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
import { UsernameIcon } from "./icons/UsernameIcon";
import { PasswordIcon } from "./icons/PasswordIcon";
import BankIcon from "/public/bank-svgrepo-com.svg";

interface LoginProps {
  handleLogin: (
    username: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: {
      code: string;
      message: string;
    };
  }>;
}

const Login: React.FC<LoginProps> = ({ handleLogin }) => {
  const { formData, errors, isLoading, handleInputChange, handleSubmit } =
    useLoginForm({ handleLogin });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-6 w-full max-w-lg mx-auto" radius="sm">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          <div className="w-16 h-16 mb-2 opacity-90 hover:opacity-100 transition-opacity">
            <Image src={BankIcon} alt="Bank Icon" className="drop-shadow-md" />
          </div>
          <div className="mb-2">
            <h4 className="font-bold text-xl">Log In</h4>
          </div>
        </CardHeader>
        <CardBody>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="min-h-[70px]">
              <Input
                variant="bordered"
                color="primary"
                isRequired
                isClearable
                onClear={() => handleInputChange("username", "")}
                placeholder="@username"
                labelPlacement="inside"
                description="Enter your username"
                type="text"
                value={formData.username}
                onValueChange={(value) => handleInputChange("username", value)}
                isInvalid={errors.username}
                errorMessage={errors.username ? "Invalid username" : undefined}
                startContent={
                  <UsernameIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
              />
            </div>
            <div className="min-h-[70px]">
              <Input
                variant="bordered"
                color="primary"
                isRequired
                placeholder="Enter your password"
                labelPlacement="inside"
                description="Enter your password"
                type="password"
                value={formData.password}
                onValueChange={(value) => handleInputChange("password", value)}
                isInvalid={errors.password}
                errorMessage={errors.password ? "Invalid password" : undefined}
                startContent={
                  <PasswordIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
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
                size="sm"
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
              <a className="text-tiny" href="/auth/reset-request">
                Forgot Username/Password?
              </a>
              <Divider className="my-2" />
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
