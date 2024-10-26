import React from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  Spacer,
} from "@nextui-org/react";

interface LoginProps {
  handleLogin: () => void;
}

const Dashboard: React.FC<LoginProps> = ({ handleLogin }) => {
  return (
    <Card className="min-w-full py-2.5 shadow-md">
      <div className="flex flex-col items-center justify-center min-h-screen min-w-full">
        <h1 className="text-2xl">Welcome to Your Dashboard!</h1>
        {/* You can add more dashboard content here */}
        <Button className="ring-2 ring-blue-500/50" onClick={handleLogin}>
          Log out
        </Button>
      </div>
    </Card>
  );
};

export default Dashboard;
