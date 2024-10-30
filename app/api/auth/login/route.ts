import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Adjust the import based on your Prisma setup
import { z } from 'zod';

// Define the schema for input validation using Zod
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Define the POST request handler
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log("Received body:", body); // Log the received body for debugging

    const { email, password } = loginSchema.parse(body); // Validate input
    console.log("Parsed email and password:", email, password); // Log parsed values

    // Check for the user in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists and if the password matches (simple comparison)
    if (user && password === user.password) { // Replace with your logic
      return NextResponse.json({ message: 'Login successful', user }, { status: 200 });
      
    } else {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    // Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return NextResponse.json({ message: 'Validation error', issues: error.errors }, { status: 400 });
    }

    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
