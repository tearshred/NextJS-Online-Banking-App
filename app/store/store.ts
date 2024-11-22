// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Make sure this path is correct
import accountReducer from './accountSlice';
import transactionReducer from './transactionSlice'
import signUpReducer from './signUpSlice';
import snapshotReducer from './snapshotSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer, 
    transaction: transactionReducer,
    signup: signUpReducer,
    snapshots: snapshotReducer
  },
});

// Export the store
export default store;

// If you are using types for your RootState and AppDispatch, you can define them like this:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
