import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store/store';
import { fetchTransactions, addTransaction as addTransactionAction } from '@/app/store/transactionSlice';
import { addTransaction as addTransactionServerAction } from '@/app/actions/transactions/addTransaction';
import { useDashboard } from './useDashboard';

interface AddTransactionParams {
  accountId: string;
  amount: number;
  description: string;
  transactionType: 'deposit' | 'withdrawal';
}

export const useAddTransaction = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useDashboard();

  const addTransaction = async (params: AddTransactionParams) => {
    try {
      const result = await addTransactionServerAction(params);
      
      dispatch(addTransactionAction(result.data));

      // Refresh transactions list immediately after adding
      if (userData?.id) {
        await dispatch(fetchTransactions(userData.id)).unwrap();
      }
      
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  return { addTransaction };
};
