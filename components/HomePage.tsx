"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store/store";
import { loginUser, logoutUser } from "../app/store/authSlice";
import { fetchAccounts } from "@/app/store/accountSlice";
import { loginAction } from "@/app/actions/auth/login";
import { validateToken } from "@/app/actions/auth/validateToken";
import Login from "../components/auth/Login";
import Dashboard from "./dashboard/Dashboard";
import { CircularProgress } from "@nextui-org/react";

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get token from localStorage or cookies
        const token = localStorage.getItem("token");

        if (token) {
          const { isValid, userData } = await validateToken(token);

          if (isValid && userData) {
            // If token is valid, set the auth state
            await dispatch(
              loginUser({ userData: { id: userData.userId }, token })
            ).unwrap();
            if (userData.userId) {
              dispatch(fetchAccounts(userData.userId));
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await loginAction(username, password);
      
      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token);

        await dispatch(
          loginUser({
            userData: { id: response.data.userData.id },
            token: response.data.token,
          })
        ).unwrap();

        if (response.data.userData.id) {
          dispatch(fetchAccounts(response.data.userData.id));
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress label="Loading..." />
      </div>
    ); // Or your loading component
  }

  return (
    <div
      className="min-h-screen md:p-2"
      style={{ backgroundColor: "transparent" }}
    >
      {isLoggedIn ? (
        <Dashboard handleLogout={handleLogout} />
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default HomePage;
