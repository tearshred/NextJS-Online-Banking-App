'use server'

import prisma from "@/lib/db";

export async function getUserData(userId: string) {
  try {
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        address: true,
        emailVerified: true,
        accounts: {
          select: {
            id: true,
            balance: true,
            accountType: true,
          }
        }
      }
    });

    if (!userData) {
      throw new Error('User not found');
    }

    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}
