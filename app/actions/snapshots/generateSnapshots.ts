'use server'

import prisma from '@/lib/db';

/**
 * Generates monthly account snapshots for specified account and number of months
 * @param accountId - The ID of the account to generate snapshots for
 * @param monthsBack - Number of months to generate snapshots for (default: 6)
 * @returns Object containing success status and generated snapshots or error message
 */
export async function generateSnapshots(accountId: string, monthsBack: number = 6) {
  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: { transactions: true }
    });

    if (!account) {
      return { success: false, error: 'Account not found' };
    }

    const currentDate = new Date();
    const snapshots = [];

    // Generate snapshots for the last N months
    for (let i = 0; i < monthsBack; i++) {
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );

      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;

      // Get transactions for this month
      const monthTransactions = account.transactions.filter(t => {
        const transDate = new Date(t.createdAt);
        return transDate.getFullYear() === year && 
               transDate.getMonth() + 1 === month;
      });

      // Calculate monthly metrics
      const totalDeposits = monthTransactions
        .filter(t => t.transactionType === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalWithdrawals = monthTransactions
        .filter(t => t.transactionType === 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0);

      // Create or update snapshot
      const snapshot = await prisma.accountSnapshot.upsert({
        where: {
          accountId_year_month: {
            accountId,
            year,
            month,
          },
        },
        create: {
          accountId,
          year,
          month,
          endingBalance: account.balance - (totalDeposits - totalWithdrawals),
          totalDeposits,
          totalWithdrawals,
          transactionCount: monthTransactions.length,
        },
        update: {
          endingBalance: account.balance - (totalDeposits - totalWithdrawals),
          totalDeposits,
          totalWithdrawals,
          transactionCount: monthTransactions.length,
        },
      });

      snapshots.push(snapshot);
    }

    return { 
      success: true, 
      data: snapshots 
    };
  } catch (error) {
    console.error('Error generating snapshots:', error);
    return { 
      success: false, 
      error: 'Failed to generate account snapshots' 
    };
  }
}