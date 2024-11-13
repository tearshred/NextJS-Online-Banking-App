"use client";

import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  Spacer,
  CircularProgress,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { registerUser } from "@/app/store/signUpSlice";

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTab, setSelectedTab] = useState("credentials");
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  
  const [formData, setFormData] = useState({
    // Credentials tab
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    // Personal info tab
    firstName: "",
    lastName: "",
    address: "",
    initialDeposit: "0",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    address: "",
    initialDeposit: "",
    general: "",
  });

  // Validate first tab fields
  useEffect(() => {
    const { email, username, password, confirmPassword } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const isValid = 
      email.trim() !== "" &&
      username.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword &&
      emailRegex.test(email);

    setIsNextEnabled(isValid);
  }, [formData.email, formData.username, formData.password, formData.confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { confirmPassword, initialDeposit, ...registerData } = formData;
      
      // Create the registration data object with all required fields
      const registrationData = {
        email: registerData.email,
        username: registerData.username,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        address: registerData.address || null, // Handle optional address
        initialBalance: parseFloat(initialDeposit) || 0 // Convert to number, default to 0
      };

      await dispatch(registerUser(registrationData)).unwrap();
      // Handle success (e.g., redirect to login)
      
    } catch (error: any) {
      setErrors(prev => ({
        ...prev,
        general: error.message || 'Registration failed'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "", general: "" }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-6 w-full max-w-md mx-auto">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          <p className="text-tiny">Welcome</p>
          <h4 className="font-bold text-large">Create Account</h4>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Tabs 
              selectedKey={selectedTab} 
              onSelectionChange={(key) => setSelectedTab(key.toString())}
            >
              <Tab key="credentials" title="Credentials">
                <div className="mt-4">
                  <Input
                    isRequired
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    className="mb-4"
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                  />
                  <Input
                    isRequired
                    label="Username"
                    value={formData.username}
                    onChange={handleInputChange("username")}
                    className="mb-4"
                    isInvalid={!!errors.username}
                    errorMessage={errors.username}
                  />
                  <Input
                    isRequired
                    type="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    className="mb-4"
                    isInvalid={!!errors.password}
                    errorMessage={errors.password}
                  />
                  <Input
                    isRequired
                    type="password"
                    label="Confirm Password"
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
                    onClick={() => setSelectedTab("personal")}
                  >
                    Next
                  </Button>
                </div>
              </Tab>
              <Tab 
                key="personal" 
                title="Personal Info"
                isDisabled={!isNextEnabled}
              >
                <div className="mt-4">
                  <Input
                    isRequired
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange("firstName")}
                    className="mb-4"
                    isInvalid={!!errors.firstName}
                    errorMessage={errors.firstName}
                  />
                  <Input
                    isRequired
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange("lastName")}
                    className="mb-4"
                    isInvalid={!!errors.lastName}
                    errorMessage={errors.lastName}
                  />
                  <Input
                    label="Address"
                    value={formData.address}
                    onChange={handleInputChange("address")}
                    className="mb-4"
                    isInvalid={!!errors.address}
                    errorMessage={errors.address}
                  />
                  <Input
                    type="number"
                    label="Initial Deposit ($)"
                    value={formData.initialDeposit}
                    onChange={handleInputChange("initialDeposit")}
                    className="mb-4"
                    isInvalid={!!errors.initialDeposit}
                    errorMessage={errors.initialDeposit}
                  />
                  <Button
                    color="primary"
                    className="w-full"
                    disabled={!isNextEnabled}
                    onClick={() => setSelectedTab("credentials")}
                  >
                    Previous
                  </Button>
                </div>
              </Tab>
            </Tabs>
            {errors.general && (
              <div className="text-danger text-sm mb-2 text-center">
                {errors.general}
              </div>
            )}
            <Spacer y={1} />
            <div className="flex justify-center">
              <Button
                className="my-1"
                color="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size="sm" aria-label="Loading..." />
                ) : (
                  "Register"
                )}
              </Button>
            </div>
            <div className="text-center mt-4">
              <a className="text-tiny" href="/auth/login">
                Already have an account? Log in
              </a>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Register;