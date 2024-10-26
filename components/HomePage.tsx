"use client"; // This line ensures this component is a client component. Necessary in order to avoid useSelector (Redux Hook) error when using with NextJS

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store/store"; //Getting the initial state for isLoggedIn from the store
import { logIn, logOut } from "../app/store/authSlice"; //Importing login and logout actions
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Dashboard from "./dashboard/Dashboard";

const HomePage: React.FC = () => {
  // Access the isLoggedIn state from the Redux store
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  // Handler to toggle login state
  const handleLoginToggle = () => {
    if (isLoggedIn) {
      dispatch(logOut());
    } else {
      dispatch(logIn());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoggedIn ? (
        <Dashboard handleLogin={handleLoginToggle}/>
      ) : (
        // Render Login component if not logged in
        <Login handleLogin={handleLoginToggle} />
      )}
    </div>
  );
};

export default HomePage;
