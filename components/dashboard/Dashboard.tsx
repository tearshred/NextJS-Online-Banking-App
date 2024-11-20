"use client";

import React from "react";
import { EmailVerificationBanner } from "./components/shared/EmailVerificationBanner";
import { TotalBalance } from "./components/balance/TotalBalance";
import IEChart from "./components/charts/IEChart";
import Transactions from "./Transactions";
import { useDashboard } from "./hooks/useDashboard";
import DepositSnapshot from "./components/balance/DepositSnapshot";
import ExpenseSnapshot from "./components/balance/ExpenseSnapshot";
import AccountsSnapshot from "./components/balance/AccountsSnapshot";
import BudgetSnapshot from "./components/balance/BudgetSnapshot";
import OpenNewAccountButton from "./open-account/OpenNewAccountButton";
interface DashboardProps {
  userId: string;
  accounts: any[];
}

const Dashboard = ({ userId, accounts }: DashboardProps) => {
  const { loading, userData, verificationEmailSent, handleResendVerification } = useDashboard();
  
  if (loading ||!userData) return <div>Loading...</div>;

  return (
    <div>
      {/* Email Verification Banner */}
      {userData.emailVerified === false && (
        <EmailVerificationBanner
          verificationEmailSent={verificationEmailSent}
          onResendVerification={handleResendVerification}
        />
      )}
      
      {/* Balance and Account Info */}
      <div className="min-w-full py-3 px-0.5">
        <div className="my-2 p-3 flex justify-between items-center">
          <TotalBalance />
          <OpenNewAccountButton />
        </div>
        {/* Account Info */}
        <div className="grid sm:grid-cols-1 md:grid-cols-3 md:mt-5 auto-rows-fr gap-3">
          <div className="h-full">
            <DepositSnapshot />
          </div>
          {/* Expenses */}
          <div className="h-full">
            <ExpenseSnapshot />
          </div>
          {/* Balances */}
          <div className="h-full">
            <AccountsSnapshot />
          </div>
        </div>
      </div>
      {/* Charts */} 
      <div className="grid sm:grid-cols-1 md:grid-cols-3 auto-rows-fr gap-3 px-0.5">
        <div className="md:col-span-1 col-span-full h-full">
          <BudgetSnapshot />
        </div>
        <div className="md:col-span-2 col-span-full h-full">
          <IEChart />
        </div>
      </div>
      {/* Transactions */}
      <Transactions accounts={accounts} />
    </div>
  );
};

export default Dashboard;
