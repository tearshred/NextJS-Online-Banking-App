import { Input, Button, CircularProgress } from "@nextui-org/react";
import { SignUpFormData, SignUpFormErrors } from "@/types";
import { useState } from "react";

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
    <div className="mt-4 h-[460px]">
      <Input
        isRequired
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleInputChange("email")}
        className="mb-4"
        isInvalid={!!formData.email && !!errors.email}
        errorMessage={errors.email}
        description="Enter a valid email address"
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
        label="Username"
        value={formData.username}
        onChange={handleInputChange("username")}
        className="mb-4"
        isInvalid={!!formData.username && !!errors.username}
        errorMessage={errors.username}
        description="Choose a unique username"
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
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleInputChange("password")}
        className="mb-4"
        isInvalid={!!formData.password && !!errors.password}
        errorMessage={errors.password}
        description="Must be at least 8 characters with uppercase, lowercase, and numbers"
      />
      <Input
        isRequired
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={handleInputChange("confirmPassword")}
        className="mb-4"
        isInvalid={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword}
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
