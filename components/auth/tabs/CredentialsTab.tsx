import { Input, Button, CircularProgress } from "@nextui-org/react";
import { SignUpFormData, SignUpFormErrors } from "@/types";
import { useState } from "react";
import { MailIcon } from "../icons/MialIcon";
import { UsernameIcon } from "../icons/UsernameIcon";
import { PasswordIcon } from "../icons/PasswordIcon";

interface CredentialsTabProps {
  formData: SignUpFormData;
  errors: SignUpFormErrors;
  isChecking: { email: boolean; username: boolean };
  isNextEnabled: boolean;
  handleInputChange: (field: keyof SignUpFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

// Renders the credentials tab content:
// - Email, username, and password inputs
// - Real-time validation feedback
// - Loading indicators for async validation
// - Next button to proceed to personal info
export const CredentialsTab: React.FC<CredentialsTabProps> = ({
  formData,
  errors,
  isChecking,
  isNextEnabled,
  handleInputChange,
  onNext,
}) => {
  return (
    <div className="mt-4 h-[380px]">
      <Input
        isRequired
        variant="bordered"
        color="primary"
        placeholder="email@example.com"
        type="email"
        value={formData.email}
        onChange={handleInputChange("email")}
        className="mb-4"
        isInvalid={!!formData.email && !!errors.email}
        errorMessage={errors.email}
        description="Enter a valid email address"
        startContent={
          <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        endContent={
          isChecking.email && (
            <CircularProgress 
              size="sm" 
              aria-label="Checking email..." 
              classNames={{
                svg: "w-4 h-4 text-default-400"
              }}
            />
          )
        }
      />
      <Input
        isRequired
        variant="bordered"
        color="primary"
        placeholder="@username"
        value={formData.username}
        onChange={handleInputChange("username")}
        className="mb-4"
        isInvalid={!!formData.username && !!errors.username}
        errorMessage={errors.username}
        description="Choose a unique username"
        startContent={
          <UsernameIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" fill="currentColor" />
        }
        endContent={
          isChecking.username && (
            <CircularProgress 
              size="sm" 
              aria-label="Checking username..." 
              classNames={{
                svg: "w-4 h-4 text-default-400"
              }}
            />
          )
        }
      />
      <Input
        isRequired
        placeholder="Enter your password"
        variant="bordered"
        color="primary"
        type="password"
        value={formData.password}
        onChange={handleInputChange("password")}
        className="mb-4"
        isInvalid={!!formData.password && !!errors.password}
        errorMessage={errors.password}
        description="Must be at least 8 characters with uppercase, lowercase, and numbers"
        startContent={
          <PasswordIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
      />
      <Input
        isRequired
        variant="bordered"
        color="primary"
        placeholder="Confirm your password"
        type="password"
        value={formData.confirmPassword}
        onChange={handleInputChange("confirmPassword")}
        className="mb-4"
        isInvalid={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword}
        startContent={
          <PasswordIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
      />
      <Button
        color="primary"
        className="w-full"
        disabled={!isNextEnabled}
        onClick={onNext}
      >
        Next
      </Button>
    </div>
  );
};
