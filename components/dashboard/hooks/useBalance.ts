import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

export const useBalance = () => {
  const accounts = useSelector((state: RootState) => state.account.accounts);
  const status = useSelector((state: RootState) => state.account.status);

  // a custom hook for formatting currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // a custom hook for calculating the total balance
  const calculateTotalBalance = () => {
    return formatCurrency(
      accounts.reduce((sum, account) => sum + account.balance, 0)
    );
  };

  return {
    totalBalance: calculateTotalBalance(),
    accounts,
    loading: status === 'loading',
    formatCurrency
  };
};