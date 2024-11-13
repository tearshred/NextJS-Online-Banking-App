"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { User } from "@/types";

export async function signUpAction(
  data: Omit<User, "id" | "accounts"> & { 
    password: string;
    initialBalance?: number;
  }
) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
    });

    if (existingUser) {
      const field = existingUser.email === data.email ? 'email' : 'username';
      throw new Error(`User with this ${field} already exists`);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Generate account number first
    const accountNumber = String(Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0'));

    // Create user with initial checking account
    const newUser = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        address: data.address,
        accounts: {
          create: {
            accountType: "checking",
            accountNumber: accountNumber,
            balance: data.initialBalance || 0
          }
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        address: true,
        accounts: {
          select: {
            id: true,
            accountType: true,
            accountNumber: true,
            balance: true
          }
        }
      }
    });

    return newUser;

  } catch (error) {
    throw error;
  }
}
