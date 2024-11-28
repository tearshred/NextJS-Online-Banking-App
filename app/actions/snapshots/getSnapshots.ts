'use server'

import prisma from '@/lib/db';

/**
 * Retrieves account snapshots from the database
 * @param accountId - The ID of the account to get snapshots for
 * @returns Object containing success status and snapshots or error message
 */
export async function getSnapshots(accountId: string) {
  try {
    const snapshots = await prisma.accountSnapshot.findMany({
      where: { accountId },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ],
      include: {
        account: {
          select: {
            accountType: true,
            accountNumber: true,
            accountNickname: true
          }
        }
      }
    });

    return {
      success: true,
      data: snapshots.map(snapshot => ({
        ...snapshot,
        createdAt: snapshot.createdAt.toISOString()
      }))
    };

  } catch (error) {
    console.error('Error fetching snapshots:', error);
    return {
      success: false,
      error: 'Failed to fetch account snapshots'
    };
  }
}

/**
 * Gets snapshots for a specific year
 */
export async function getYearSnapshots(accountId: string, year: number) {
  try {
    const snapshots = await prisma.accountSnapshot.findMany({
      where: { 
        accountId,
        year 
      },
      orderBy: { month: 'desc' },
      include: {
        account: {
          select: {
            accountType: true,
            accountNumber: true,
            accountNickname: true
          }
        }
      }
    });

    return {
      success: true,
      data: snapshots.map(snapshot => ({
        ...snapshot,
        createdAt: snapshot.createdAt.toISOString()
      }))
    };

  } catch (error) {
    console.error('Error fetching year snapshots:', error);
    return {
      success: false,
      error: 'Failed to fetch year snapshots'
    };
  }
}

/**
 * Gets snapshots for a specific month range
 */
export async function getRecentSnapshots(accountId: string, months: number = 6) {
  try {
    // console.log('🔍 [getRecentSnapshots] Starting with:', { accountId, months });
    
    // First, verify the account exists
    const account = await prisma.account.findUnique({
      where: { id: accountId }
    });
    // console.log('📊 [getRecentSnapshots] Account found:', account);

    if (!account) {
      // console.error('❌ [getRecentSnapshots] Account not found');
      return {
        success: false,
        error: 'Account not found'
      };
    }

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - months, 1);
    
    // console.log('📅 [getRecentSnapshots] Query date range:', {
    //   startYear: startDate.getFullYear(),
    //   startMonth: startDate.getMonth() + 1,
    //   endYear: today.getFullYear(),
    //   endMonth: today.getMonth() + 1
    // });

    // Log the exact query we're about to make
    const query = {
      where: {
        accountId,
        OR: [
          {
            year: startDate.getFullYear(),
            month: { gte: startDate.getMonth() + 1 }
          },
          {
            year: today.getFullYear(),
            month: { lte: today.getMonth() + 1 }
          }
        ]
      }
    };
    // console.log('🔎 [getRecentSnapshots] Query:', JSON.stringify(query, null, 2));

    const snapshots = await prisma.accountSnapshot.findMany({
      ...query,
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ],
      include: {
        account: {
          select: {
            accountType: true,
            accountNumber: true,
            accountNickname: true
          }
        }
      }
    });

    // console.log('📈 [getRecentSnapshots] Found snapshots:', 
    //   snapshots.length ? snapshots : 'No snapshots found'
    // );

    // If no snapshots, let's check if any snapshots exist at all for this account
    if (!snapshots.length) {
      const allSnapshots = await prisma.accountSnapshot.findMany({
        where: { accountId },
        take: 1
      });
      // console.log('🔍 [getRecentSnapshots] Checking if any snapshots exist:', 
      //   allSnapshots.length ? 'Yes' : 'No'
      // );
    }

    return {
      success: true,
      data: snapshots.map(snapshot => ({
        ...snapshot,
        createdAt: snapshot.createdAt.toISOString()
      }))
    };

  } catch (error) {
    console.error('❌ [getRecentSnapshots] Error:', error);
    return {
      success: false,
      error: 'Failed to fetch recent snapshots'
    };
  }
}
