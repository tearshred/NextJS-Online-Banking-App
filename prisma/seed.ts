import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

// Only run seeding in development, skip in production
if (process.env.NODE_ENV === 'production') {
  console.log('Skipping seed in production')
  process.exit(0)
}

const prisma = new PrismaClient()

async function main() {
  try {
    // Root user credentials
    const rootUser = {
      firstName: 'Root',
      lastName: 'Admin',
      email: 'vesa.rs.92@gmail.com',      // Replace with actual email
      username: 'root_admin',          // Replace with desired username
      password: 'Password123'         // Replace with actual password
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(rootUser.password, 10)

    // Create or update root user
    const user = await prisma.user.upsert({
      where: { username: rootUser.username },
      update: {},
      create: {
        firstName: rootUser.firstName,
        lastName: rootUser.lastName,
        email: rootUser.email,
        username: rootUser.username,
        password: hashedPassword,
        // Optional fields are left undefined
        address: null,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
        // Create a default account for the root user
        accounts: {
          create: {
            accountType: "checking",
            balance: 1000.00,
            // Example transaction
            transactions: {
              create: {
                amount: 1000.00,
                transactionType: "deposit",
              }
            }
          }
        }
      }
    })

    console.log('Database seeded with root user:', user.username)
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
