"use client";

import UserProfile from "@/components/dashboard/UserProfile";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { checkAuthStatus, fetchUserData } from "@/app/store/authSlice";

export default function ProfilePage() {
  const { isLoggedIn, loading, userData } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const initializeData = async () => {
      try {
        if (!mounted) return;
        const token = localStorage.getItem('token');
        console.log("Token check:", { 
          hasToken: !!token, 
          tokenValue: token,
          isLoggedIn,
          hasUserData: !!userData 
        });

        if (!token) {
          console.log("No token, redirecting");
          router.replace('/');
          return;
        }

        // First get basic auth data
        const authResult = await dispatch(checkAuthStatus()).unwrap();
        console.log("Auth check result:", authResult);
        
        if (authResult?.id) {
          // Then fetch full user data
          const userDataResult = await dispatch(fetchUserData(authResult.id)).unwrap();
          console.log("User data result:", userDataResult);
        } else {
          console.log("Auth check failed - no ID returned");
          router.replace('/');
        }
      } catch (error) {
        if (!mounted) return;
        console.error("Profile initialization error:", error);
        router.replace('/');
      }
    };

    if (!userData?.firstName) {
      initializeData();
    }

    return () => {
      mounted = false;
    };
  }, [dispatch, router, userData]);

  if (loading || !userData?.firstName) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return <UserProfile />;
} 