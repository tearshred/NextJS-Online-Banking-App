// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Make sure this path is correct

const store = configureStore({
  reducer: {
    auth: authReducer, // Add auth reducer here
  },
});

// Export the store
export default store;

// If you are using types for your RootState and AppDispatch, you can define them like this:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
