import { useMemo, useState } from "react";
import type { Selection } from "@nextui-org/react";
import { useBalance } from "./useBalance";

export const useBudgetAccountSelection = () => {
  const { accounts } = useBalance();
  const [selectedAccount, setSelectedAccount] = useState<Selection>(
    new Set(["all"])
  );

  const selectedValue = useMemo(() => {
    const selected = Array.from(selectedAccount)[0];
    if (!selected || selected === "all") return "All Accounts";

    const account = accounts.find((acc) => acc.id.toString() === selected);
    return account
      ? `${account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} ${account.accountNumber ? `(x${account.accountNumber.slice(-4)})` : ""}`
      : "Select Account";
  }, [selectedAccount, accounts]);

  return {
    selectedAccount,
    setSelectedAccount,
    selectedValue,
    accounts
  };
};