// src/app/store/authSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types"; // Ensure you have a User type defined in types/index.ts
import prisma from "../../lib/db"; // Ensure this path is correct
import { validateToken } from '@/app/actions/auth/validateToken'; // Import the server action
import { getUserData } from '@/app/actions/users/userData'; // Import the server action

// Define an interface for the initial state
interface AuthState {
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  tokenData: string | null; // Token-related data
  userData: User | null; // Full user profile data
}

// Initial state
const initialState: AuthState = {
  isLoggedIn: false,
  loading: false,
  error: null,
  tokenData: null,
  userData: null,
};

// Async thunk for logging in
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ userData, token }: { 
    userData: User;  // Change from Partial<User> to User
    token: string;
  }) => {
    // Save token to localStorage
    localStorage.setItem('token', token);

    // Return the user data and token
    return { userData, token };
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  // Implement your logout logic here (e.g., clear session)
  return { isLoggedIn: false }; // You can return nothing for logout
});

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      // Direct call to the server action instead of fetch
      const result = await validateToken(token);

      console.log('Validation request made:', {
        endpoint: 'validateToken server action',
        tokenExists: !!token,
        result
      });

      if (!result.isValid) {
        localStorage.removeItem('token');
        return rejectWithValue('Invalid token');
      }
      // Add type assertion to unknown first
      // It's like telling TypeScript: "Yes, I know these types don't match, but I'm consciously choosing to treat this data as this type."
      return (result.userData as unknown) as User;
      
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue('Auth check failed');
    }
  }
);

// Rename the thunk
export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (userId: string) => {
    const userData = await getUserData(userId);
    // Remove createdAt from both user and accounts. We don't need it on the client side.
    const { createdAt, ...userDataWithoutDate } = userData;
    const accounts = userData.accounts.map(({ createdAt, ...account }) => account);
    
    return { ...userDataWithoutDate, accounts } as User;
  }
);

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.tokenData = null; // Clear token-related data on logout
      state.userData = null; // Clear user data on logout
    },
  },
  // Extra reducers for handling asynchronous actions
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true; // Set loading to true while the login request is in progress
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.userData = action.payload.userData;
        state.tokenData = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false; // Set loading to false when login fails
        state.error = action.error.message || "Login failed"; // Store the error message
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false; // Set isLoggedIn to false on logout
        state.tokenData = null; // Clear token-related data on logout
        state.userData = null; // Clear user data on logout
        state.error = null; // Clear any previous errors if needed
        localStorage.removeItem('token'); // Remove token
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.userData = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoggedIn = false;
        state.userData = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.userData = null;
      });
  },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
