"use server";
import jwt from 'jsonwebtoken';
import { ensureJWTSecret } from '@/lib/generateSecret';

const JWT_SECRET = ensureJWTSecret();

export async function validateToken(token: string) {
    try {
        console.log('Received token:', token.slice(0, 10) + '...');
        console.log('Token length:', token.length);
        console.log('Secret first chars:', JWT_SECRET.slice(0, 3) + '...');

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        console.log('Token decoded successfully:', decoded);
        return { isValid: true, userData: decoded };
    } catch (error: any) {
        console.error('Token validation failed. Error type:', error.name);
        console.error('Error message:', error.message);
        return { isValid: false, userData: null };
    }
} 