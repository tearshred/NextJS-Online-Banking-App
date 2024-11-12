'use server'

import prisma from '@/lib/db'

export async function getUserData(userId: string) {
  if (!userId) {
    throw new Error("User ID is required")
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
      }
    })

    if (!user) {
      throw new Error("User not found")
    }

    return user
  } catch (error) {
    console.error("Error fetching user data:", error)
    throw new Error("Failed to fetch user data")
  }
}
