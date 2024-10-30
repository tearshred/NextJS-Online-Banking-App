import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import {
  Input,
  Image,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Spacer,
  Divider,
} from "@nextui-org/react";

import AccountInfo from "./AccountInfo";

// Define the shape of your user data based on your UserData interface
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  username: string;
  // Add any other fields as needed
}

interface DashboardProps {
  handleLogout: () => Promise<void>;
  userData: UserData | null;
}

const Dashboard: React.FC<DashboardProps> = ({ handleLogout, userData }) => {
  //Preventing the app from crashing if there is an error
  const [error, setError] = useState<string | null>(null);

  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <Card className="min-w-full py-2.5 shadow-md">
      <div className="m-6">
        <div className="flex justify-between">
          <h1 className="text-2xl ">
            Welcome, {userData.firstName} {userData.lastName}
          </h1>
          <Button color="primary" variant="bordered" onClick={handleLogout}>
            Log out
          </Button>
        </div>
        <Divider className="my-4" />
      </div>
      <div className="grid grid-flow-col justify-stretch m-4 p-10">
        <Card
          shadow="sm"
          // isPressable
          // onPress={() => console.log("item pressed")}
          className="mr-4"
        >
          <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold">Account Info</p>
            {/* <small className="text-default-500">12 Tracks</small>
            <h4 className="font-bold text-large">Frontend Radio</h4> */}
          </CardHeader>
          <CardBody className="overflow-visible p-4">
            <p>Email: {userData.email}</p>
            <p>Address: {userData.address}</p>
            <p>username: {userData.username}</p>
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>Draft 1</b>
            <p className="text-default-500">$</p>
          </CardFooter>
        </Card>
        <Card shadow="sm" className="ml-4">
          <CardHeader>
            <p className="text-tiny uppercase font-bold">Balances</p>
          </CardHeader>
          <CardBody className="overflow-visible p-3">
            <Card
              shadow="none"
              radius="none"
              isPressable
              onPress={() => console.log("checking account")}
            >
              Checking: $11,123.92
            </Card>
            {/* <Divider /> */}
            <Card
              shadow="none"
              radius="none"
              isPressable
              onPress={() => console.log("savings account")}
            >
              Savings: $25,000.00
            </Card>
            <Card
              shadow="none"
              radius="none"
              isPressable
              onPress={() => console.log("brokerage account")}
            >
              Brokerage: $271,425.31
            </Card>
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>Draft 1</b>
            <p className="text-default-500">$</p>
          </CardFooter>
        </Card>
      </div>
    </Card>
  );
};

export default Dashboard;
