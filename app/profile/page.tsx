"use client";

import UserProfile from "@/components/dashboard/UserProfile";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CircularProgress } from "@nextui-org/react";
import { authService } from "@/app/services/authService";

export default function ProfilePage() {
  // Get auth state from Redux store
  const { isLoggedIn, userData } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  // Loading state for initial auth check
  const [isLoading, setIsLoading] = useState(true);
  // State to track if auth check has completed
  const [authChecked, setAuthChecked] = useState(false);

  // First useEffect: Initialize authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is authenticated (validates token, gets user data)
        await authService.initializeAuth(dispatch);
        // Mark auth check as complete
        setAuthChecked(true);
      } finally {
        // Always set loading to false when done, regardless of outcome
        setIsLoading(false);
      }
    };

    initAuth();
  }, [dispatch]); // Only re-run if dispatch changes

  // Second useEffect: Handle redirects after auth check
  useEffect(() => {
    // Only redirect if auth check is complete and user is not logged in
    if (authChecked && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [authChecked, isLoggedIn, router]); // Run when auth status or check state changes

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress aria-label="Loading..." />
      </div>
    );
  }

  // Show loading spinner if not logged in or no user data
  // This prevents flash of unauthorized content
  if (!isLoggedIn || !userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress aria-label="Loading..." />
      </div>
    );
  }

  // If all checks pass, render the profile
  return <UserProfile />;
} 