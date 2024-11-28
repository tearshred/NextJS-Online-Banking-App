"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PasswordResetForm from '@/components/auth/password-reset/PasswordResetForm';
import { validatePasswordResetToken } from '@/app/actions/auth/validatePasswordToken';
import { CircularProgress } from '@nextui-org/react';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  console.log('Token:', token);

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        const result = await validatePasswordResetToken(token);
        setIsValidToken(result.isValid);
      } else {
        setIsValidToken(false);
      }
    };

    checkToken();
  }, [token]);

  if (isValidToken === null) {
    return <div className="flex items-center justify-center min-h-screen"><CircularProgress /></div>;
  }

  if (!isValidToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Invalid or expired reset token. Please check your email for a new link.</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">No reset token provided. Please check your email for a new link.</p>
      </div>
    );
  }

  return <PasswordResetForm token={token} />;
}