// app/api/active-user-data/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Adjust the import based on your Prisma setup

const activeUserId = `1`;

export async function GET(request: Request) {
  try {
    // Hardcoded user ID for testing
    const userId = activeUserId; // Ensure this matches the type defined in your Prisma schema

    // Fetch user data from the database
    const user = await prisma.user.findUnique({
      where: { id: userId }, // Make sure `id` is a string type in your schema
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return the user data
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
