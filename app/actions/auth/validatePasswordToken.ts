"use server";
import prisma from '@/lib/db';

export async function validatePasswordResetToken(token: string) {
  try {
    // Check if the user exists based on the resetPasswordToken
    const user = await prisma.user.findUnique({
      where: { resetPasswordToken: token },
      select: { 
        id: true,
        resetPasswordTokenExpiry: true
      }
    });

    // If user does not exist, return invalid
    if (!user) {
      return { isValid: false, message: 'Invalid or expired token' };
    }

    // Check if the reset password token has expired
    const isExpired = user.resetPasswordTokenExpiry ? user.resetPasswordTokenExpiry < new Date() : true;

    if (isExpired) {
      return { isValid: false, message: 'Invalid or expired token' };
    }

    return {
      isValid: true,
      userData: { userId: user.id }
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return { isValid: false, message: 'Token validation failed' };
  }
}