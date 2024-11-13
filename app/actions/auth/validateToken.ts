"use server";
import { verify } from 'jsonwebtoken';
import prisma from '@/lib/db';

export async function validateToken(token: string) {
  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'default-secret-key') as { userId: string };
    
    // Just get the ID from validation, full data will be fetched separately
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true }
    });

    if (!user) {
      return { isValid: false, userData: null };
    }

    return {
      isValid: true,
      userData: { userId: user.id }
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return { isValid: false, userData: null };
  }
} 