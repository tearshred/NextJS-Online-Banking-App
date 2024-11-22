import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTransactions } from '@/app/actions/transactions/getTransactions';

// Define the interface for transaction data
interface Transaction {
  id: string;
  accountId: string; // ID of the associated account
  amount: number;
  transactionType: string; // e.g., "deposit", "withdrawal"
  description: string | null;
  // date: string; // ISO string format for the transaction date
  createdAt: string;
}

// Define the initial state interface
interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

// Async thunk to fetch transactions for an account
export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions', 
  async (userId: string, { rejectWithValue }) => {
    try {
      // console.log('Fetching transactions for userId:', userId);
      const response = await getTransactions(userId);
      // console.log('Got response:', response);
      
      if (!response?.transactions) {
        return rejectWithValue('No transactions data received');
      }
      
      return response.transactions;
    } catch (error: any) {
      console.error('Error in fetchTransactions:', error);
      return rejectWithValue(error.message || 'Failed to fetch transactions');
    }
  }
);

// Create the transaction slice
const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    // Add a transaction
    addTransaction(state, action) {
      state.transactions.push(action.payload);
    },
    // Remove a transaction
    removeTransaction(state, action) {
      state.transactions = state.transactions.filter(transaction => transaction.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch transactions';
        state.transactions = [];
      });
  },
});

// Export actions and reducer
export const { addTransaction, removeTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
