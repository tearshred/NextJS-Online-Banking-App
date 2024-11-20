import { Card, CardBody } from "@nextui-org/react";
import { useBalance } from "../../hooks/useBalance";

export const TotalBalance = () => {
  const { totalBalance } = useBalance();

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-default-600">Total Balance</span>
      <span className="text-xl font-semibold">${totalBalance}</span>
    </div>
  );
};
