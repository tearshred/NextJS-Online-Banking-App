"use server";

import prisma from "@/lib/db";
import crypto from 'crypto';
import { sendEmail } from '../emails/sendEmail';

// Helper function to send verification email (can be used by both signup and resend)
export async function sendVerificationEmail(email: string, emailVerificationToken: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  await sendEmail({
    from: 'Admin <admin@mylittledevhub.com>',
    to: [email],
    subject: 'Verify Your Email Address',
    templateType: 'verifyEmail',
    templateData: { 
      email,
      emailVerificationToken,
      resetLink: `${baseUrl}/auth/verify-email?token=${emailVerificationToken}`
    },
    text: `To verify your email, click the following link: ${baseUrl}/auth/verify-email?token=${emailVerificationToken}`
  });
}

// Function to handle resending verification email
export async function triggerVerificationEmail(email: string) {
  try {
    const emailVerificationToken = crypto.randomBytes(32).toString('base64url');
    
    await prisma.user.update({
      where: { email },
      data: {
        emailVerificationToken: {
          set: emailVerificationToken
        }
      }
    });

    await sendVerificationEmail(email, emailVerificationToken);
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

// Function to verify the token when user clicks the email link
export async function verifyEmail(token: string) {
  try {
    // First, check if there's a user with this token
    // We use findFirst because token should be unique
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
      },
      // Select only the fields we need
      select: {
        id: true,
        email: true,
        emailVerified: true,
        emailVerificationToken: true
      }
    });

    // If no user found with this token
    if (!user) {
      // Check if a user exists that was already verified with this token
      // This handles the case where someone clicks the verification link again
      const verifiedUser = await prisma.user.findFirst({
        where: {
          emailVerified: true,
          emailVerificationToken: null, // Token should be cleared after verification
        },
      });

       // If we found a verified user, return success but mark as already verified
      if (verifiedUser) {
        return { success: true, alreadyVerified: true };
      }

      // If no user found at all, the token is invalid
      throw new Error("Invalid verification token");
    }

    // If the user exists but is already verified 
    // This shouldn't happen in normal flow as token should be cleared
    if (user.emailVerified) {
      return { success: true, alreadyVerified: true };
    }

    // Perform the verification for first time
    // Update user record to mark as verified and clear the token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: {
          set: null  // Clear the token after use
        }
      },
      select: {
        id: true,
        email: true,
        emailVerified: true
      }
    });
    return { success: true, alreadyVerified: false }; // First time verification

  } catch (error) {
    console.error("Error verifying email:", {
      error,
      token,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Failed to verify email");
  }
} 