import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store/store';
import { fetchUserData } from '@/app/store/authSlice';// adjust import path as needed
import { triggerVerificationEmail } from "@/app/actions/users/verifyEmail";

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const userId = useSelector((state: RootState) => state.auth.userData?.id);
  

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error("User ID is missing");
        return;
      }

      try {
        await dispatch(fetchUserData(userId));
      } catch (error) {
        // console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, dispatch]);

  const handleResendVerification = async () => {
    if (!userData?.email) {
      console.error("No user email available");
      return;
    }
    
    try {
      await triggerVerificationEmail(userData.email);
      setVerificationEmailSent(true);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      throw error;
    }
  };

  return {
    loading,
    userData,
    verificationEmailSent,
    setVerificationEmailSent,
    handleResendVerification
  };
};