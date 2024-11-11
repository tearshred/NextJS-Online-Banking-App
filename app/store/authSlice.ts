// src/app/store/authSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types"; // Ensure you have a User type defined in types/index.ts
import prisma from "../../lib/db"; // Ensure this path is correct
import { validateToken } from '@/app/actions/auth/validateToken'; // Import the server action

// Define an interface for the initial state
interface AuthState {
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  userData: {
    userId: string;
    username: string;
    iat: number;
    exp: number;
  } | null; // This is what we get from the token
  userProfile: User | null; // This will store the full user data
}

// Initial state
const initialState: AuthState = {
  isLoggedIn: false,
  loading: false,
  error: null,
  userData: null,
  userProfile: null,
};

// Async thunk for logging in
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ userData, token }: { 
    userData: Partial<User>;  // Make User partial since we might only have id
    token: string;
  }) => {
    console.log('Token structure:', {
      token,
      tokenLength: token?.length,
      isString: typeof token === 'string'
    });
    
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

// Add new thunk to fetch full user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json() as User;
  }
);

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
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
        state.loading = false; // Set loading to false when login is successful
        state.isLoggedIn = true; // Update isLoggedIn based on the response
        state.userData = action.payload.userData as unknown as User; // Store the user data
        state.error = null; // Clear any previous errors
        // Don't try to access token since it's not returned from the thunk
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false; // Set loading to false when login fails
        state.error = action.error.message || "Login failed"; // Store the error message
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false; // Set isLoggedIn to false on logout
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
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.userProfile = null;
      });
  },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
