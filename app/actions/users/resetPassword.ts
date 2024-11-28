"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import { sendEmail } from '@/app/actions/emails/sendEmail';

// Function to request a password reset
export async function requestPasswordReset(email: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return "If an account exists with this email, you will receive a password reset link.";
    }

    // Generate a secure reset password token
    const resetPasswordToken = crypto.randomBytes(32).toString('base64url');
    const today = new Date();
    const expiryDate = new Date(today.setDate(today.getDate() + 1));

    await prisma.user.update({
        where: { email },
        data: {
            resetPasswordToken,
            resetPasswordTokenExpiry: expiryDate,
        }
    });

    await sendEmail({
        from: 'Admin <admin@mylittledevhub.com>',
        to: [email],
        subject: 'Password Reset',
        templateType: 'passwordReset',
        templateData: { 
            email, 
            resetPasswordToken,
            resetLink: `${baseUrl}/auth/reset-password?token=${resetPasswordToken}`
        },
        text: `To reset your password, click the following link: ${baseUrl}/auth/reset-password?token=${resetPasswordToken}`
    });

    return "Password reset e-mail sent. Please check your inbox";
};

// Function to reset the password using the token
export const resetPassword = async (token: string, newPassword: string) => {
    // console.log("Attempting to reset password with token:", token);

    const user = await prisma.user.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordTokenExpiry: {
                gt: new Date()
            }
        }
    });

    if (!user) {
        // console.log("No user found with valid token");
        throw new Error("Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpiry: null
        }
    });

    return "Password successfully reset";
};
