'use server'

import prisma from '@/lib/db'

interface AddTransactionParams {
  accountId: string;
  amount: number;
  description: string;
  transactionType: 'deposit' | 'withdrawal';
}

async function validateAndUpdateBalance(
  accountId: string, 
  amount: number, 
  transactionType: 'deposit' | 'withdrawal'
): Promise<boolean> {
  // First get the current account balance
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: { balance: true }
  });

  if (!account) {
    throw new Error('Account not found');
  }

  // For withdrawals, check if there's enough balance
  if (transactionType === 'withdrawal' && account.balance < amount) {
    return false;
  }

  // Update the balance
  await prisma.account.update({
    where: { id: accountId },
    data: {
      balance: {
        increment: transactionType === 'withdrawal' 
          ? -Math.abs(amount) 
          : Math.abs(amount)
      }
    }
  });

  return true;
}

export async function addTransaction(params: AddTransactionParams) {
  try {
    // Validate and update balance first
    const canProceed = await validateAndUpdateBalance(
      params.accountId,
      params.amount,
      params.transactionType
    );

    if (!canProceed) {
      // Return an error object instead of throwing
      return {
        error: 'Insufficient funds for withdrawal'
      };
    }

    // If balance update was successful, create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        accountId: params.accountId,
        amount: Math.abs(params.amount),
        description: params.description,
        transactionType: params.transactionType,
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

    return {
      data: {
        ...transaction,
        createdAt: transaction.createdAt.toISOString(),
      }
    };
  } catch (error) {
    console.error('Error in addTransaction:', error);
    return {
      error: 'An error occurred while processing your transaction'
    };
  }
}
