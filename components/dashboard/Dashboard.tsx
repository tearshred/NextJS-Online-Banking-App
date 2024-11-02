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
  accounts: any[]; // Array of accounts for the user
  accountStatus: string; // Status of accounts fetch (optional)
}

const Dashboard: React.FC<DashboardProps> = ({
  handleLogout,
  userData,
  accounts,
  accountStatus,
}) => {
  //Preventing the app from crashing if there is an error
  const [error, setError] = useState<string | null>(null);

  // Log accounts data on each update
  useEffect(() => {
    console.log("Accounts data:", accounts); // Check if accounts data is being loaded
  }, [accounts]);

  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>Loading...</div>;
  

  return (
    <div>
      <div className="min-w-full py-3 px-0.5" id="card">
        {/* Header */}
        <div className="mb-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl ">
              Welcome, {userData.firstName} {userData.lastName}
            </h1>
            <Button color="primary" variant="bordered" onClick={handleLogout}>
              Log out
            </Button>
          </div>
          {/* <Divider className="my-1" /> */}
        </div>
        {/* Account Info */}
        <div className="grid grid-cols-2 auto-rows-fr gap-3">
          <div className="h-full">
            <Card shadow="md" radius="none" className="h-full flex flex-col">
              <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">Account Info</p>
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
          </div>
          {/* Balances */}
          <div className="h-full">
            <Card shadow="md" radius="none" className="h-full flex flex-col">
              <CardHeader>
                <p className="text-tiny uppercase font-bold">Balances</p>
              </CardHeader>
              <CardBody className="overflow-visible p-3">
                {/* {accounts.type}: ${accounts.balance} */}
                <ul>
                  {accounts.map((account) => (
                    <li key={account.id}>
                      <div>
                        <Card
                          className="flex-row"
                          shadow="none"
                          radius="none"
                          isPressable
                          onPress={() => console.log(account.accountType + " account")}
                        >
                          {account.accountType}: ${account.balance}
                        </Card>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b>Draft 1</b>
                <p className="text-default-500">$</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <AccountInfo />
    </div>
  );
};

export default Dashboard;
