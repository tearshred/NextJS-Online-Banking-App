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

// This interface defines the expected shape of props for the Login component.
// It requires a handleLogin function with no arguments and no return value.

// *** Good to know *** //
// Interface is a TypeScript feature that defines the structure of an object, helping ensure that components receive the correct data
// types and properties, which improves code quality and reduces errors.

interface LoginProps {
  handleLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
        <p className="text-tiny ">Welcome Back</p>
        <small className="text-default-500"></small>
        <h4 className="font-bold text-large">Online Banking</h4>
      </CardHeader>
      <CardBody>
        <Input
          isClearable
          onClear={() => console.log("input cleared")}
          defaultValue=""
          label="Username"
          labelPlacement="inside"
          type="username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <Button className="my-1" color="primary" onClick={handleLogin}>
          Log In
        </Button>
        <Button className="my-1" onClick={handleLogin}>
          Sign Up
        </Button>
      </CardBody>
    </Card>
  );
};

export default Login;
