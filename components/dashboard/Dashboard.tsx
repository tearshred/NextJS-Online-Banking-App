import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
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
import { BalanceIcon } from "../icons";

import AccountInfo from "./AccountInfo";
import IEChart from "./IEChart";
import ForgotPassword from "../auth/ForgotPassword";
import PasswordResetForm from "../auth/PasswordResetForm";
import { fetchUserProfile } from "@/app/store/authSlice";

interface DashboardProps {
  handleLogout: () => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ handleLogout }) => {
  //Preventing the app from crashing if there is an error
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const userProfile = useSelector((state: RootState) => state.auth.userProfile);
  const accounts = useSelector((state: RootState) => state.account.accounts);
  const accountStatus = useSelector((state: RootState) => state.account.status);

  useEffect(() => {
    if (userData?.userId && !userProfile) {
      dispatch(fetchUserProfile(userData.userId));
    }
  }, [userData, userProfile, dispatch]);

  if (error) return <div>Error: {error}</div>;
  if (!userData || !userProfile) return <div>Loading...</div>;

  console.log(userProfile?.firstName);

  return (
    <div>
      <div className="min-w-full py-3 px-0.5" id="card">
        {/* Header */}
        <div className="mb-3">
          <div className="flex justify-between items-center ">
            <h1 className="text-2xl ">Welcome, {userProfile.firstName}</h1>
            <Button onClick={handleLogout} color="primary" variant="bordered">
              Log out
            </Button>
          </div>
          <Divider className="my-4" />
        </div>
        <div className="my-2 grid-cols-3">
          <h1 className="text-2xl"><b>$88,491.37</b></h1>
          <p className="text-tiny">Total Balance</p>
          
        </div>
        {/* Account Info */}
        <div className="grid sm:grid-cols-1 md:grid-cols-3 md:mt-4 auto-rows-fr gap-3">
          <div className="h-full">
            <Card
              shadow="sm"
              radius="sm"
              className="h-full flex flex-col"
            >
              <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">Income</p>
              </CardHeader>
              <CardBody className="overflow-visible p-4 grid grid-cols-3">
                <div className="col-span-2">
                  <h1>$ 88,198.77</h1> <BalanceIcon fill="red"/>
                </div>
                <div>
                  <h1>Test</h1>
                </div>
              </CardBody>
              <CardFooter className="text-small justify-between"></CardFooter>
            </Card>
          </div>
          {/* Expenses */}
          <div className="h-full">
            <Card
              shadow="sm"
              radius="sm"
              className="h-full flex flex-col"
            >
              <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">Expenses</p>
              </CardHeader>
              <CardBody className="overflow-visible p-4 grid grid-cols-3">
                <div className="col-span-2">
                  <h1>$ 13,512.51</h1> <BalanceIcon fill="red"/>
                </div>
                <div>
                  <h1>Test</h1>
                </div>
                </CardBody>
              <CardFooter className="text-small justify-between"></CardFooter>
            </Card>
          </div>
          {/* Balances */}
          <div className="h-full">
            <Card shadow="sm" radius="sm" className="h-full flex flex-col">
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
                        >
                          <span className="uppercase">{account.accountType}</span>: ${account.balance}.00
                        </Card>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter className="text-small justify-between"></CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <IEChart />
      <AccountInfo />
    </div>
  );
};

export default Dashboard;
