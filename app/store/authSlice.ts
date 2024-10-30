// authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import prisma from "../../lib/db"; // Ensure this path is correct

// Define an interface for the user data and auth state
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  username: string;
  // Add other fields as needed
}

// Define an interface for the initial state
interface AuthState {
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  userData: UserData | null;
}

// Initial state
const initialState: AuthState = {
  isLoggedIn: false,
  loading: false,
  error: null,
  userData: null
};

// Async thunk for logging in
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    return { 
      isLoggedIn: true,
      userData: data.user
    }; // Return this upon successful login
  }
);
// Async thunk for logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  // Implement your logout logic here
  // For example, clear any session or token
  return { isLoggedIn: false }; // You can return nothing for logout
});


// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.userData = null; //Clear user data on logout
    },
  },
  // Extra reducers for handling asynchronous actions
  extraReducers: (builder) => {
    builder
      // Handle the pending state of the loginUser async thunk
      .addCase(loginUser.pending, (state) => {
        state.loading = true; // Set loading to true while the login request is in progress
      })
      // Handle the fulfilled state of the loginUser async thunk
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when login is successful
        state.isLoggedIn = action.payload.isLoggedIn; // Update isLoggedIn based on the response
        state.userData = action.payload.userData;
        state.error = null; // Clear any previous errors
      })
      // Handle the rejected state of the loginUser async thunk
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false; // Set loading to false when login fails
        state.error = action.error.message || "Login failed"; // Store the error message or a default message
      })
      // ... existing cases for loginUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false; // Set isLoggedIn to false on logout
        state.error = null; // Clear any previous errors if needed
      });
  },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
