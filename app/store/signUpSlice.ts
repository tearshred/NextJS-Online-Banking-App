import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types";
import { signUpAction } from '@/app/actions/users/signUp';

interface SignUpState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SignUpState = {
  loading: false,
  error: null,
  success: false,
};

export const registerUser = createAsyncThunk(
  'signup/register',
  async (userData: Omit<User, "id" | "accounts"> & { 
    password: string;
    initialBalance?: number;
  }, { rejectWithValue }) => {
    try {
      const newUser = await signUpAction(userData);
      return newUser;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const signUpSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    resetSignUp: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSignUp } = signUpSlice.actions;
export default signUpSlice.reducer; 