import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

// Define the initial state of the auth slice
const initialState = {
  isLoggedIn: false, // Default state
};

// Create a slice of the state for authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to set the login state
    logIn: (state) => {
      state.isLoggedIn = true; // Set logged in state to true
    },
    logOut: (state) => {
      state.isLoggedIn = false; // Set logged in state to false
    },
  },
});

// Export the actions to use in components
export const { logIn, logOut } = authSlice.actions;

// Configure the store
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer, // Add the auth slice to the store
  },
});

// Export the RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
