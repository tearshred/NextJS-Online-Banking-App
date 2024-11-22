import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { BalanceIcon } from "@/components/icons";
import React from "react";
import { useCalculateWithdrawals } from "../../hooks/calculateTotalWithdrawals";

const ExpenseSnapshot = () => {
  const { monthlyWithdrawals } = useCalculateWithdrawals();

  return (
    <Card shadow="sm" radius="sm" className="h-full flex flex-col">
      <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">Total Withdrawals This Month</p>
      </CardHeader>
      <CardBody className="overflow-visible p-4 grid grid-cols-3">
        <div className="col-span-2">
          <h1>$ {monthlyWithdrawals.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</h1>
          <BalanceIcon fill="red" />
        </div>
        <div>
          {/* You can add additional information here if needed */}
        </div>
      </CardBody>
      <CardFooter className="text-small justify-between">
        {/* Add any footer content if needed */}
      </CardFooter>
    </Card>
  );
};

export default ExpenseSnapshot;
