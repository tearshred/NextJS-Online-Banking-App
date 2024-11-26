import { Input, Button } from "@nextui-org/react";
import { SignUpFormData, SignUpFormErrors } from "@/types";

interface PersonalInfoTabProps {
  formData: SignUpFormData;
  errors: SignUpFormErrors;
  handleInputChange: (
    field: keyof SignUpFormData
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrevious: () => void;
}

// Renders the personal information tab content:
// - First name, last name (required fields)
// - Address (optional)
// - Initial deposit amount
// - Previous button to return to credentials
export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  formData,
  errors,
  handleInputChange,
  onPrevious,
}) => {
  return (
    <div className="mt-4 h-[380px]">
      <Input
        isRequired
        variant="bordered"
        color="primary"
        description="First Name"
        value={formData.firstName}
        onChange={handleInputChange("firstName")}
        className="mb-4"
        isInvalid={!!errors.firstName}
        errorMessage={errors.firstName}
      />
      <Input
        isRequired
        variant="bordered"
        color="primary"
        description="Last Name"
        value={formData.lastName}
        onChange={handleInputChange("lastName")}
        className="mb-4"
        isInvalid={!!errors.lastName}
        errorMessage={errors.lastName}
      />
      <Input
        variant="bordered"
        color="primary"
        description="Address"
        value={formData.address}
        onChange={handleInputChange("address")}
        className="mb-4"
        isInvalid={!!errors.address}
        errorMessage={errors.address}
      />
      <Input
        variant="bordered"
        color="primary"
        type="number"
        description="Initial Deposit ($)"
        value={formData.initialDeposit}
        onChange={handleInputChange("initialDeposit")}
        className="mb-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        isInvalid={!!errors.initialDeposit}
        errorMessage={errors.initialDeposit}
      />
      <Button color="primary" className="w-full" onClick={onPrevious}>
        Previous
      </Button>
    </div>
  );
};
