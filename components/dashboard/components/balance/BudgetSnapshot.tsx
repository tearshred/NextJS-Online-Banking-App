import React from "react";
import {
  Card,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useBudgetAccountSelection } from "../../hooks/useBudgetAccountSelection";

const BudgetSnapshot = () => {
  const { selectedAccount, setSelectedAccount, selectedValue, accounts } =
    useBudgetAccountSelection();

  //Sample data
  const budgetData = [
    { name: "Used", value: 70, color: "#22c55e" },
    { name: "Remaining", value: 30, color: "#94A3B8" },
  ];
  
  return (
    <Card shadow="sm" radius="sm" className="h-full w-full flex flex-col">
      <div className="p-4 w-full">
        <div className="grid grid-cols-2 items-center mb-4 w-full">
          <h2 className="text-xl font-semibold">Monthly Budget</h2>
          <div className="flex justify-end">
            <Dropdown backdrop="blur">
              <DropdownTrigger>
                <Button variant="bordered">{selectedValue}</Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select Account"
                selectionMode="single"
                selectedKeys={selectedAccount}
                onSelectionChange={setSelectedAccount}
              >
                {[
                  <DropdownItem key="all">Accounts</DropdownItem>,
                  ...accounts.map((account) => (
                    <DropdownItem key={account.id.toString()}>
                      {account.accountType.charAt(0).toUpperCase() +
                        account.accountType.slice(1)}{" "}
                      {account.accountNumber
                        ? `(x${account.accountNumber.slice(-4)})`
                        : ""}
                    </DropdownItem>
                  )),
                ]}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>

          <div className="text-center mt-4">
            <p className="text-2xl font-bold text-gray-800">70%</p>
            <p className="text-sm text-slate-800">of monthly budget used</p>
            <div className="mt-4">
              <p className="text-sm text-slate-800">
                <span className="font-semibold">$3,500</span> spent of{" "}
                <span className="font-semibold">$5,000</span> budget
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BudgetSnapshot;
