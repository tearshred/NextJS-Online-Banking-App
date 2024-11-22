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
import { Card } from "@nextui-org/react";

interface DashboardProps {
  userId: string;
  accounts: any[];
}

const Dashboard = ({ userId, accounts }: DashboardProps) => {
  const { loading, userData, verificationEmailSent, handleResendVerification } = useDashboard();
  
  // Find the checking account
  const checkingAccount = accounts.find(account => account.accountType === 'CHECKING');
  
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
          {checkingAccount ? (
            <IEChart accountId={checkingAccount.id} />
          ) : (
            <Card shadow="sm" radius="sm" className="h-full">
              <div className="w-full p-4">
                <h2 className="text-xl font-semibold mb-4">Income & Expenses</h2>
                <div className="h-[400px] flex items-center justify-center">
                  No checking account found
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      {/* Transactions */}
      <Transactions accounts={accounts} />
    </div>
  );
};

export default Dashboard;
