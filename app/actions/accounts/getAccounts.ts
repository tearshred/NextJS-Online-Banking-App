"use server";

import prisma from "@/lib/db";

export async function getAccounts(userId: string) {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId: userId
      }
    });
    
    return {
      success: true,
      data: accounts
    };
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return {
      success: false,
      error: "Failed to fetch accounts"
    };
  }
}
