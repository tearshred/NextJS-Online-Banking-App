import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { BalanceIcon } from "@/components/icons";
import React from "react";

const ExpenseSnapshot = () => {
  return (
    <Card shadow="sm" radius="sm" className="h-full flex flex-col">
      <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">Spending</p>
      </CardHeader>
      <CardBody className="overflow-visible p-4 grid grid-cols-3">
        <div className="col-span-2">
          <h1>$ 14,512.51</h1> <BalanceIcon fill="red" />
        </div>
        <div>
          <h1>Test</h1>
        </div>
      </CardBody>
      <CardFooter className="text-small justify-between"></CardFooter>
    </Card>
  );
};

export default ExpenseSnapshot;
