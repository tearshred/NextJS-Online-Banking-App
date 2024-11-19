"use server"

import prisma from "@/lib/db";

export async function checkAvailabilityAction(field: 'email' | 'username', value: string) {
  try {
    const count = await prisma.user.count({
      where: {
        [field]: value
      }
    });
    
    return {
      available: count === 0,
      message: count > 0 ? `This ${field} is already taken` : null
    };
  } catch (error) {
    console.error(`Error checking ${field} availability:`, error);
    return {
      available: false,
      message: "Error checking availability"
    };
  }
} 