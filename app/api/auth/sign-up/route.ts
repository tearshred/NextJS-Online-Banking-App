// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

// Updated schema to match database structure
const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
});

export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const { email, password, firstName, lastName, username } = signupSchema.parse(body);

    // Check if user already exists (both email and username)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return NextResponse.json(
        { message: `User with this ${field} already exists` },
        { status: 409 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        username,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: newUser,
      },
      { status: 201 }
    );

  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle Prisma errors 
    // Per Documentation - P2002 is "Unique constraint failed on the {constraint}"
    // Plain Engish :) -  it's a Prisma-specific error indicating a unique constraint violation. This means that an attempt was made to insert or update a record in the database with a value that already exists in a column or combination of columns marked as unique.
    // Ref - https://www.prisma.io/docs/orm/reference/error-reference#error-codes
    if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2002') {
      const field = (error as Prisma.PrismaClientKnownRequestError).meta as { target?: string[] };
      return NextResponse.json(
        {
          message: `A user with this ${field} already exists`,
        },
        { status: 409 }
      );
    }

    // Log the error for debugging
    console.error('Signup error:', error);

    // Return generic error to client
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}