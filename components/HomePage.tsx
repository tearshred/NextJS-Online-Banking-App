"use client"; // This line ensures this component is a client component. Necessary in order to avoid useSelector (Redux Hook) error when using with NextJS

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store/store"; //Getting the initial state for isLoggedIn from the store
import { loginUser, logoutUser } from "../app/store/authSlice"; //Importing login and logout actions
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Dashboard from "./dashboard/Dashboard";

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userData = useSelector((state: RootState) => state.auth.userData);

  const handleLogin = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Adjust based on your API structure
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed'); // Throw an error if login fails
    }

    // console.log("Attempting to log in with:", email, password); // Log the attempt
  try {
    const result = await dispatch(loginUser({ email, password })).unwrap();
    // console.log("Login action result:", result); // This should log the fulfilled action
  } catch (error) {
    console.error("Login error:", error);
  }

    const data = await response.json();
    dispatch(loginUser({ email, password })); // Handle successful login (e.g., redirect or update state)
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      console.log('isLoggedIn: ' + isLoggedIn)
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoggedIn ? (
        <Dashboard userData={userData} handleLogout={handleLogout} />
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default HomePage;