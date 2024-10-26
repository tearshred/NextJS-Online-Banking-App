import { createSlice } from "@reduxjs/toolkit";

// Define the shape of the Auth state
interface AuthState {
  isLoggedIn: boolean; // Represents whether the user is logged in or not
}

// Set the initial state of the Auth slice
const initialState: AuthState = {
  isLoggedIn: false, // The initial value is false (user is not logged in)
};

// Create a slice of the Redux store for authentication
const authSlice = createSlice({
  name: "auth", // Name of the slice
  initialState, // The initial state defined above
  reducers: {
    // Reducer to handle user login
    logIn: (state) => {
      state.isLoggedIn = true; // Set isLoggedIn to true when the user logs in
    },
    // Reducer to handle user logout
    logOut: (state) => {
      state.isLoggedIn = false; // Set isLoggedIn to false when the user logs out
    },
  },
});

// Export actions for use in components
export const { logIn, logOut } = authSlice.actions;

// Export the reducer to be included in the store
export default authSlice.reducer;
