// accountSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Account } from '@/types';
import prisma from '@/lib/db';

export const fetchAccounts = createAsyncThunk(
  'account/fetchAccounts',
  async (userId: string, thunkAPI) => {
    try {
      console.log("Fetching accounts for user ID:", userId); // Log user ID
      const response = await fetch(`/api/account/${userId}`, {
        method: 'GET',
      });

      // Check if the response is okay (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const accounts = await response.json();
      console.log("Accounts fetched:", accounts); // Log fetched accounts
      return accounts;
    } catch (error) {
      console.error("Error fetching accounts:", error); // Log any error
      return thunkAPI.rejectWithValue("Failed to fetch accounts");
    }
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    accounts: [] as Account[],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.accounts = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = 'failed';
        console.error('Error fetching accounts:', action.payload);
      });
  },
});

export default accountSlice.reducer;
