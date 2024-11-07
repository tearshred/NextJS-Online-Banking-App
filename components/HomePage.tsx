"use client"; // This line ensures this component is a client component. Necessary in order to avoid useSelector (Redux Hook) error when using with NextJS

import React, {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store/store"; //Getting the initial state for isLoggedIn from the store
import { loginUser, logoutUser } from "../app/store/authSlice"; //Importing login and logout actions
import { fetchAccounts } from "@/app/store/accountSlice";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Dashboard from "./dashboard/Dashboard";
import { User, Account } from "@/types"; 

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userData = useSelector((state: RootState) => state.auth.userData); // Changed to remove TypeScript error
  const accounts: Account[] = useSelector((state: RootState) => state.account.accounts);
  const accountStatus = useSelector((state: RootState) => state.account.status);

  // Fetch accounts when user is logged in
  useEffect(() => {
    if (isLoggedIn  && userData?.id) {
      dispatch(fetchAccounts(userData.id)); // Fetch accounts if logged in
    }
  }, [isLoggedIn, userData, dispatch]);

  const handleLogin = async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), // Adjust based on your API structure
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed'); // Throw an error if login fails
    }

    // console.log("Attempting to log in with:", username, password); // Log the attempt
  try {
    const result = await dispatch(loginUser({ username, password })).unwrap();
    console.log("Login action result:", result); // This should log the fulfilled action
    // After logging in, fetch accounts for the user
    if (result.userData?.id) {
      dispatch(fetchAccounts(result.userData?.id));
    }
  } catch (error) {
    console.error("Login error:", error);
  }

    const data = await response.json();
    dispatch(loginUser({ username, password })); // Handle successful login (e.g., redirect or update state)
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      console.log('User logged in: ' + isLoggedIn)
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen md:p-2" style={{backgroundColor: "transparent"}}>
      {isLoggedIn ? (
        <Dashboard 
          handleLogout={handleLogout} 
        />
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default HomePage;