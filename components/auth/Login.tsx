"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  Spacer,
} from "@nextui-org/react";

interface LoginProps {
   handleLogin: (email: string, password: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Logging in with: ", email, password); // Log email and password
    try {
      await handleLogin(email, password); // Async login function
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
        <p className="text-tiny">Welcome Back</p>
        <h4 className="font-bold text-large">Online Banking</h4>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <Input
            isClearable
            onClear={() => setEmail("")}
            label="Email"
            labelPlacement="inside"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Input
            label="Password"
            labelPlacement="inside"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Spacer y={1} />
          <Button className="my-1" color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Logging In..." : "Log In"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default Login;
