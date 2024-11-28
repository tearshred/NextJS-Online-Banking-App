import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRecentSnapshots } from '@/app/actions/snapshots/getSnapshots';
import type { AccountSnapshot } from '@/types';

interface SnapshotState {
  snapshots: AccountSnapshot[];
  loading: boolean;
  error: string | null;
}

const initialState: SnapshotState = {
  snapshots: [],
  loading: false,
  error: null,
};

export const fetchAccountSnapshots = createAsyncThunk(
  'snapshots/fetchRecent',
  async (accountId: string, { rejectWithValue }) => {
    try {
      // console.log('🚀 [Redux] Fetching snapshots for account:', accountId);
      const response = await getRecentSnapshots(accountId);
      // console.log('📦 [Redux] Response:', response);
      
      if (!response.success) {
        return rejectWithValue(response.error);
      }
      return response.data;
    } catch (error) {
      console.error('❌ [Redux] Error:', error);
      return rejectWithValue('Failed to fetch snapshots');
    }
  }
);

const snapshotSlice = createSlice({
  name: 'snapshots',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountSnapshots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountSnapshots.fulfilled, (state, action) => {
        state.loading = false;
        state.snapshots = (action.payload ?? []).map(snapshot => ({
          ...snapshot,
          createdAt: new Date(snapshot.createdAt),
          account: {
            ...snapshot.account,
            id: snapshot.accountId,
            userId: '',
            balance: 0,
            accountNickname: snapshot.account.accountNickname || undefined
          }
        }));
        state.error = null;
      })
      .addCase(fetchAccountSnapshots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch snapshots';
      });
  },
});

export default snapshotSlice.reducer;
