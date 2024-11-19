import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'

// Only run seeding in development, skip in production
if (process.env.NODE_ENV === 'production') {
  console.log('Skipping seed in production')
  process.exit(0)
}

const prisma = new PrismaClient()

// Helper function to generate random transactions
function generateTransactions(count: number) {
  return Array(count).fill(null).map(() => ({
    amount: parseFloat(faker.finance.amount({ min: -5000, max: 5000, dec: 2 })),
    transactionType: faker.helpers.arrayElement(['deposit', 'withdrawal']),
    description: faker.helpers.arrayElement([
      'Salary Deposit',
      'ATM Withdrawal',
      'Online Transfer',
      'Grocery Shopping',
      'Utility Bill',
      'Restaurant Payment'
    ]),
    date: faker.date.past({ years: 1 })
  }))
}

// Helper function to generate accounts
function generateAccounts(count: number) {
  return Array(count).fill(null).map(() => ({
    accountType: faker.helpers.arrayElement(['checking', 'savings']),
    accountNumber: faker.finance.accountNumber(10),
    balance: parseFloat(faker.finance.amount({ min: 1000, max: 50000, dec: 2 })),
    transactions: {
      create: generateTransactions(faker.number.int({ min: 5, max: 15 }))
    }
  }))
}

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
        accounts: {
          create: generateAccounts(3) // Create 3 accounts for root user
        }
      }
    })

    // Create additional test users with accounts
    for (let i = 0; i < 5; i++) {
      const testUser = await prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          username: faker.internet.userName(),
          password: hashedPassword, // Using same password for simplicity
          accounts: {
            create: generateAccounts(faker.number.int({ min: 1, max: 3 }))
          }
        }
      })
      console.log(`Created test user: ${testUser.username}`)
    }

    console.log('Database seeded successfully')
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
