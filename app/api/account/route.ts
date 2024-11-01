// app/api/account/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';

// Define the schema for account creation
const accountSchema = z.object({
  userId: z.string().uuid(), // Ensure userId is a valid UUID
  accountType: z.enum(['checking', 'savings']), // Define account types
  balance: z.number().nonnegative(), // Ensure balance is a non-negative number
});

// Define the POST request handler for creating an account
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, accountType, balance } = accountSchema.parse(body); // Validate input

    // Create a new account
    const newAccount = await prisma.account.create({
      data: {
        userId,
        accountType,
        balance,
      },
    });

    return NextResponse.json(
      { message: 'Account created successfully', account: newAccount },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', issues: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating account:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Define the GET request handler for retrieving accounts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    // Validate that userId is provided and is a valid UUID
    if (!userId || !/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/.test(userId)) {
      return NextResponse.json(
        { message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Fetch accounts for the specified user
    const accounts = await prisma.account.findMany({
      where: { userId },
    });

    return NextResponse.json({ accounts }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving accounts:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
