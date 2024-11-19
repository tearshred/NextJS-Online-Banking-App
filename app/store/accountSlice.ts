// accountSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Account } from '@/types';
import { getAccounts } from '@/app/actions/accounts/getAccounts';
import { RootState } from './store';

interface AccountState {
  accounts: Account[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  routingNumber: string;
}

const serializeAccount = (account: any) => ({
  ...account,
  createdAt: account.createdAt?.toISOString(),
  updatedAt: account.updatedAt?.toISOString(),
});

export const fetchAccounts = createAsyncThunk(
  'account/fetchAccounts',
  async (userId: string) => {
    try {
      const response = await getAccounts(userId);
      
      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data?.map(serializeAccount) ?? [];
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw new Error("Failed to fetch accounts");
    }
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    accounts: [] as Account[],
    status: 'idle',
    routingNumber: '123456789'
  } as AccountState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.accounts = action.payload ?? [];
        state.status = 'succeeded';
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = 'failed';
        console.error('Error fetching accounts:', action.payload);
      });
  },
});

export const selectRoutingNumber = (state: RootState) => state.account.routingNumber;

export default accountSlice.reducer;
