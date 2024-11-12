"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store/store";
import { authService } from "@/app/services/authService";
import Login from "../components/auth/Login";
import Dashboard from "./dashboard/Dashboard";
import { CircularProgress } from "@nextui-org/react";
import { getAccounts } from "@/app/actions/accounts/getAccounts";

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    authService.initializeAuth(dispatch).finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (userData?.id) {
        const result = await getAccounts(userData.id);
        if (result.success) {
          setAccounts(result.data ?? []);
        }
      }
    };

    fetchAccounts();
  }, [userData?.id]);

  const handleLogin = async (username: string, password: string): Promise<void> => {
    try {
      await authService.login(dispatch, username, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    await authService.logout(dispatch);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress label="Loading..." />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen md:p-2"
      style={{ backgroundColor: "transparent" }}
    >
      {isLoggedIn ? (
        <Dashboard 
          userId={userData?.id || ''} 
          handleLogout={handleLogout}
          accounts={accounts}
        />
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default HomePage;
