"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ensureJWTSecret } from '@/lib/generateSecret';
import { revalidatePath } from "next/cache";

const JWT_SECRET = ensureJWTSecret();

interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    userData: any;  // Replace 'any' with your user type
  };
  error?: {
    code: string;
    message: string;
  };
}

export async function loginAction(username: string, password: string): Promise<LoginResponse> {
    if (!username || !password) {
        return {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Username and password are required'
            }
        };
    }

    try {
        // Find user
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return {
                success: false,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Username not found'
                }
            };
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return {
                success: false,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid password'
                }
            };
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        revalidatePath('/');
        
        return {
            success: true,
            data: {
                token,
                userData: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    address: user.address || undefined,
                }
            }
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'An error occurred during login'
            }
        };
    }
} 