import { NextResponse } from 'next/server'; // Use NextResponse for responses
import prisma from '@/lib/db'; // Adjust this import based on your setup

// GET method to fetch accounts for a specific user
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params; // Extract userId from the params

  // Check if userId is present
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Fetch accounts using the dynamic userId
    const accounts = await prisma.account.findMany({
      where: { userId: String(userId) }, // Ensure userId is a string
    });

    return NextResponse.json(accounts, { status: 200 }); // Return the accounts as JSON
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}
