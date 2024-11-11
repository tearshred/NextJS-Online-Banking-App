"use client";

import { useSelector } from 'react-redux';
import { redirect } from 'next/navigation';
import { RootState } from '@/app/store/store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    useEffect(() => {
        // Redirect to homepage in all cases - login form is there
        router.push('/');
    }, [router]);

    return null; // Show nothing while redirecting
}
