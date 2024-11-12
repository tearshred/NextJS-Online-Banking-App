'use client'

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
import { fetchUserData } from "@/app/store/authSlice";
import { User } from "@/types";
import { getUserData } from '@/app/actions/users/userData'

interface DashboardProps {
  userId: string;
  handleLogout: () => Promise<void>;
  accounts: any[];
}

const Dashboard = ({ userId, handleLogout, accounts }: DashboardProps) => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error('User ID is missing');
        return;
      }

      try {
        await dispatch(fetchUserData(userId));
      } catch (error) {
        // console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, dispatch]);

  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <div className="min-w-full py-3 px-0.5" id="card">
        {/* Header */}
        <div className="mb-3">
          <div className="flex justify-between items-center ">
            <h1 className="text-2xl ">Welcome, {userData.firstName}</h1>
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
                <ul>
                  {accounts && accounts.length > 0 ? (
                    accounts.map((account) => (
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
                    ))
                  ) : (
                    <li>No accounts found</li>
                  )}
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
