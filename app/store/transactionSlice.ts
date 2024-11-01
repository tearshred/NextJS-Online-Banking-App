import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import prisma from '@/lib/db'; // Ensure the path is correct

// Define the interface for transaction data
interface Transaction {
  id: string;
  accountId: string; // ID of the associated account
  amount: number;
  transactionType: string; // e.g., "deposit", "withdrawal"
  date: string; // ISO string format for the transaction date
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
export const fetchTransactions = createAsyncThunk('transaction/fetchTransactions', async (accountId: string) => {
    const transactions = await prisma.transaction.findMany({
      where: { accountId },
      select: {
        id: true,
        accountId: true,
        amount: true,
        transactionType: true,
        createdAt: true, // Assuming this is your date field; adjust if necessary
      },
    });
    return transactions.map(transaction => ({
      ...transaction,
      date: transaction.createdAt.toISOString(), // Format it as needed
    }));
  });

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
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      });
  },
});

// Export actions and reducer
export const { addTransaction, removeTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
