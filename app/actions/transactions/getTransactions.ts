'use server'

import prisma from '@/lib/db'

export async function getTransactions(userId: string) {
  if (!userId) {
    console.error('No userId provided to getTransactions');
    throw new Error('UserId is required');
  }

  try {    
    const transactions = await prisma.transaction.findMany({
      where: {
        account: {
          userId: userId
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        accountId: true,
        amount: true,
        transactionType: true,
        description: true,
        createdAt: true,
      }
    });
    
    const formattedTransactions = transactions.map(transaction => ({
      ...transaction,
      date: transaction.createdAt.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
    }));

    return { transactions: formattedTransactions };
    
  } catch (error) {
    console.error('Detailed error in getTransactions:', {
      error,
      userId,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    });
    throw error; // Throw the original error to maintain the stack trace
  }
}
