import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

export const useCalculateWithdrawals = () => {
  const { transactions } = useSelector((state: RootState) => state.transaction);
  
  const getCurrentMonthWithdrawals = () => {
    if (!transactions?.length) return 0;

    // In order to calculate deposits for current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        return (
          transaction.transactionType === 'withdrawal' &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  return {
    monthlyWithdrawals: getCurrentMonthWithdrawals(),
  };
};
