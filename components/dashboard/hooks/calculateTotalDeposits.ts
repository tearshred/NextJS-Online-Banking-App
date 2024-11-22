import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

export const useCalculateDeposits = () => {
  const { transactions } = useSelector((state: RootState) => state.transaction);
  
  const getCurrentMonthDeposits = () => {
    if (!transactions?.length) return 0;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        return (
          transaction.transactionType === 'deposit' &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  return {
    monthlyDeposits: getCurrentMonthDeposits(),
  };
};
