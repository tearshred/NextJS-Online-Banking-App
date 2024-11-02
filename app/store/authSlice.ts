// src/app/store/authSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types"; // Ensure you have a User type defined in types/index.ts
import prisma from "../../lib/db"; // Ensure this path is correct

// Define an interface for the initial state
interface AuthState {
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  userData: User | null; // User type can be null initially
}

// Initial state
const initialState: AuthState = {
  isLoggedIn: false,
  loading: false,
  error: null,
  userData: null,
};

// Async thunk for logging in
export const loginUser = createAsyncThunk<
  { isLoggedIn: boolean; userData: User }, // Return type on success
  { username: string; password: string } // Argument type for the thunk
>("auth/loginUser", async ({ username, password }) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();
  return { 
    isLoggedIn: true,
    userData: data.user // Ensure data.user matches the User type
  };
});

// Async thunk for logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  // Implement your logout logic here (e.g., clear session)
  return { isLoggedIn: false }; // You can return nothing for logout
});

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
        state.isLoggedIn = action.payload.isLoggedIn; // Update isLoggedIn based on the response
        state.userData = action.payload.userData; // Store the user data
        state.error = null; // Clear any previous errors
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false; // Set loading to false when login fails
        state.error = action.error.message || "Login failed"; // Store the error message
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false; // Set isLoggedIn to false on logout
        state.userData = null; // Clear user data on logout
        state.error = null; // Clear any previous errors if needed
      });
  },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
