"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store/store";
import { authService } from "@/app/services/authService";
import Dashboard from "./dashboard/Dashboard";
import { CircularProgress } from "@nextui-org/react";
import { getAccounts } from "@/app/actions/accounts/getAccounts";
import { useRouter } from 'next/navigation';
import Login from "./auth/Login";

const HomePage: React.FC = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    const initAuth = async () => {
      await authService.initializeAuth(dispatch);
      setIsLoading(false);
      
      if (!isLoggedIn) {
        router.push('/auth/login');
      }
    };

    initAuth();
  }, [dispatch, isLoggedIn, router]);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (userData?.id) {
        const result = await getAccounts(userData.id);
        if (result.success) {
          setAccounts(result.data ?? []);
        }
      }
    };

    if (isLoggedIn) {
      fetchAccounts();
    }
  }, [userData?.id, isLoggedIn]);

  const handleLogout = async () => {
    await authService.logout(dispatch);
    router.push('/auth/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress label="Loading..." />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div
      className="min-h-screen md:p-2"
      style={{ backgroundColor: "transparent" }}
    >
      <Dashboard 
        userId={userData?.id || ''}
        accounts={accounts}
      />
    </div>
  );
};

export default HomePage;
