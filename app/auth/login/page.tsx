"use client";

import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store/store';
import { authService } from '@/app/services/authService';
import Login from '@/components/auth/Login';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CircularProgress } from "@nextui-org/react";

export default function LoginPage() {
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

    const handleLogin = async (username: string, password: string) => {
        try {
            const result = await authService.login(dispatch, username, password);
            //console.log("Auth service result:", result);

            if (result.success) {
                router.push('/');
                return { success: true };
            }

            // If login failed, return the error from authService
            return {
                success: false,
                error: result.error || {
                    code: 'LOGIN_ERROR',
                    message: 'Login failed'
                }
            };
        } catch (error) {
            console.error("Login error:", error);
            return { 
                success: false, 
                error: { 
                    code: 'LOGIN_ERROR', 
                    message: error instanceof Error ? error.message : 'Login failed' 
                }
            };
        }
    };

    if (isLoading || isLoggedIn) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <CircularProgress aria-label="Loading..." />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Login handleLogin={handleLogin} />
        </div>
    );
}
