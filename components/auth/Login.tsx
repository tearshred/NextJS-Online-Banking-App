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

interface LoginProps {
  handleLogin: (username: string, password: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Logging in with: ", username, password); // Log username and password
    try {
      await handleLogin(username, password); // Async login function
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-6 w-full max-w-md mx-auto">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          <p className="text-tiny">Welcome Back</p>
          <h4 className="font-bold text-large">Log In</h4>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Input
              isRequired
              isClearable
              onClear={() => setUsername("")}
              label="Username"
              labelPlacement="inside"
              type="text"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4"
            />
            <Input
              isRequired
              label="Password"
              labelPlacement="inside"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  setPassword(""); // Clear the password field
                }
              }}
              className="mb-4"
            />
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
                  "Log In"
                )}
              </Button>
            </div>
            <div>
              <a className="text-tiny" href="#">Forgot Username/Password?</a>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
