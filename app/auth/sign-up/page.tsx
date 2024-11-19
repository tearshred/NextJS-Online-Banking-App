'use client'

import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store/store';
import { authService } from '@/app/services/authService';
import SignUpForm from '@/components/auth/sign-up/SignUpForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CircularProgress } from "@nextui-org/react";

// Sign-up page wrapper component:
// - Handles authentication state
// - Redirects if user is already logged in
// - Shows loading state during auth check
// - Renders the main sign-up form
export default function SignUpPage() {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            await authService.initializeAuth(dispatch);
            if (isLoggedIn) {
                router.push('/');
            } else {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [dispatch, isLoggedIn, router]);

    if (isLoading || isLoggedIn) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <CircularProgress aria-label="Loading..." />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <SignUpForm />
        </div>
    );
}
