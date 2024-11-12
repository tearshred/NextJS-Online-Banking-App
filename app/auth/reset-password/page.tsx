"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PasswordResetForm from '@/components/auth/PasswordResetForm';

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

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Invalid or missing reset token.</p>
      </div>
    );
  }

  return <PasswordResetForm token={token} />;
}