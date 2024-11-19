"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Spacer,
  CircularProgress,
  Tabs,
  Tab,
  Button,
} from "@nextui-org/react";
import { useSignUpForm } from "../hooks/useSignUpForm";
import { CredentialsTab } from "../tabs/CredentialsTab";
import { PersonalInfoTab } from "../tabs/PersonalInfoTab";
import SignUpSuccess from "./SignUpSuccess";

const SignUpForm: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("credentials");
  const {
    formData,
    errors,
    isLoading,
    isSuccess,
    isNextEnabled,
    isFormValid,
    isChecking,
    handleInputChange,
    handleSubmit,
  } = useSignUpForm();

  if (isSuccess) {
    return <SignUpSuccess />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-[440px]">
        <CardHeader className="flex-col items-center">
          <p className="text-tiny">Welcome</p>
          <h4 className="font-bold text-large">Create Account</h4>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Tabs 
              selectedKey={selectedTab} 
              onSelectionChange={(key) => setSelectedTab(key.toString())}
              color="primary"
              variant="bordered"
              classNames={{
                tabList: "w-full gap-6",
                tab: "flex-1 h-10",
                tabContent: "text-center"
              }}
            >
              <Tab key="credentials" title="Credentials">
                <CredentialsTab
                  formData={formData}
                  errors={errors}
                  isChecking={isChecking}
                  isNextEnabled={isNextEnabled}
                  handleInputChange={handleInputChange}
                  onNext={() => setSelectedTab("personal")}
                />
              </Tab>
              <Tab 
                key="personal" 
                title="Personal Info"
                isDisabled={!isNextEnabled}
              >
                <PersonalInfoTab
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  onPrevious={() => setSelectedTab("credentials")}
                />
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
                isDisabled={!isFormValid || isLoading}
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

export default SignUpForm;