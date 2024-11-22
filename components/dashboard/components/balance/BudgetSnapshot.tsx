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
import { useCalculateWithdrawals } from "../../hooks/calculateTotalWithdrawals";

const BudgetSnapshot = () => {
  const { selectedAccount, setSelectedAccount, selectedValue, accounts } =
    useBudgetAccountSelection();
  const { monthlyWithdrawals } = useCalculateWithdrawals();

  // Set fixed monthly budget
  const MONTHLY_BUDGET = 5000;
  
  // Calculate budget metrics
  const usedBudget = monthlyWithdrawals;
  const remainingBudget = MONTHLY_BUDGET - usedBudget;
  
  // Calculate percentage used without upper limit
  const percentageUsed = Math.round((usedBudget / MONTHLY_BUDGET) * 100);
  
  // Calculate how much over budget (if applicable)
  const percentageOverBudget = percentageUsed > 100 ? percentageUsed - 100 : 0;
  
  // Function to determine color based on percentage
  const getColorByPercentage = (percentage: number): string => {
    if (percentage <= 25) return "#15803D";      // Green
    if (percentage <= 50) return "#EAB308";      // Yellow
    if (percentage <= 75) return "#f97316";      // Orange
    return "#B91C1C";                            // Red
  };
  
  // Prepare data for pie chart
  const budgetData = [
    { 
      name: "Used", 
      value: percentageUsed > 100 ? 100 : percentageUsed, // Cap at 100 for visual only
      color: getColorByPercentage(percentageUsed),
      legendColor: "#0F172A"
    },
    { 
      name: "Remaining", 
      value: percentageUsed > 100 ? 0 : (100 - percentageUsed),
      color: "#CBD5E1",
      legendColor: "#0F172A"
    },
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
              <Legend 
                verticalAlign="bottom" 
                align="center"
                height={36}
                formatter={(value) => (
                  <span className="text-slate-800">{value}</span>
                )}
                iconSize={14}
                // wrapperStyle={{
                //   paddingTop: "20px"
                // }}
                iconType="square"       // Makes the icon a square
                payload={budgetData.map(item => ({
                  value: item.name,
                  // type: item.type,
                  id: item.name,
                  color: item.color,    // Keeps original color for icon
                }))}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="text-center mt-4">
            <p className={`text-2xl font-bold`} 
               style={{ color: getColorByPercentage(percentageUsed) }}>
              {percentageUsed}%
            </p>
            <p className="text-sm text-slate-800">
              {percentageUsed > 100 
                ? `${percentageOverBudget}% over budget` 
                : 'of monthly budget used'}
            </p>
            <div className="mt-4">
              <p className="text-sm text-slate-800">
                <span className="font-semibold" 
                      style={{ color: getColorByPercentage(percentageUsed) }}>
                  ${usedBudget.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span> spent of{" "}
                <span className="font-semibold">
                  ${MONTHLY_BUDGET.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span> budget
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BudgetSnapshot;
