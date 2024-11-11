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

interface LoginError {
  type: 'username_not_found' | 'invalid_password' | 'other';
  message: string;
}

const Login: React.FC<LoginProps> = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({
      username: "",
      password: "",
      general: ""
    });

    // Validate empty fields
    if (!username.trim() || !password.trim()) {
      setErrors({
        username: !username.trim() ? "Username is required" : "",
        password: !password.trim() ? "Password is required" : "",
        general: ""
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await handleLogin(username, password);
    } catch (error: any) {
      console.log('Login component error:', error);
      
      // Handle different error cases
      const errorMessage = error?.message || "An unexpected error occurred";
      
      if (errorMessage === "Invalid credentials") {
        setErrors({
          username: "",
          password: "Invalid username or password",
          general: ""
        });
      } else if (errorMessage.includes("Database error")) {
        setErrors({
          username: "",
          password: "",
          general: "A system error occurred. Please try again later."
        });
      } else {
        setErrors({
          username: "",
          password: "",
          general: "An unexpected error occurred"
        });
      }
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
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors(prev => ({ ...prev, username: "", general: "" }));
              }}
              className="mb-4"
              isInvalid={!!errors.username}
              errorMessage={errors.username}
            />
            <Input
              isRequired
              label="Password"
              labelPlacement="inside"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors(prev => ({ ...prev, password: "", general: "" }));
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !password) {
                  setPassword("");
                }
              }}
              className="mb-4"
              isInvalid={!!errors.password}
              errorMessage={errors.password}
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
              <a className="text-tiny" href="/auth/reset-request">Forgot Username/Password?</a>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
