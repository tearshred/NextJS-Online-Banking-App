import { useCallback } from 'react';
import { 
  getSnapshots,
  getYearSnapshots,
  getRecentSnapshots
} from '@/app/actions/snapshots/getSnapshots';

export const useSnapshots = () => {
  const fetchSnapshots = useCallback(async (accountId: string) => {
    try {
      const result = await getSnapshots(accountId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      console.error('Failed to fetch snapshots:', error);
      throw error;
    }
  }, []);

  const fetchYearSnapshots = useCallback(async (accountId: string, year: number) => {
    try {
      const result = await getYearSnapshots(accountId, year);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      console.error('Failed to fetch year snapshots:', error);
      throw error;
    }
  }, []);

  const fetchRecentSnapshots = useCallback(async (accountId: string, months: number = 6) => {
    try {
      console.log('🎣 [useSnapshots] Fetching recent snapshots for account:', accountId);
      const result = await getRecentSnapshots(accountId, months);
      console.log('📦 [useSnapshots] Result:', result);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      console.error('❌ [useSnapshots] Error:', error);
      throw error;
    }
  }, []);

  return { 
    fetchSnapshots,
    fetchYearSnapshots,
    fetchRecentSnapshots
  };
};