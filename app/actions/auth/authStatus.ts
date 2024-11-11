import { createAsyncThunk } from '@reduxjs/toolkit';
import { validateToken } from './validateToken';
import { User } from '@/types';
import jwt from 'jsonwebtoken';

// Check authentication status
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const result = await validateToken(token);
      if (!result.isValid) {
        localStorage.removeItem('token');
        return rejectWithValue('Invalid token');
      }
      
      return result.userData;
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue('Authentication failed');
    }
  }
);

// Login status handler
export const updateLoginStatus = createAsyncThunk(
  'auth/updateLoginStatus',
  async (user: User, { rejectWithValue }) => {
    try {
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'default-secret-key',
        { expiresIn: '24h' }
      );

      localStorage.setItem('token', token);
      return user;
    } catch (error) {
      return rejectWithValue('Failed to update login status');
    }
  }
);

// Logout status handler
export const updateLogoutStatus = createAsyncThunk(
  'auth/updateLogoutStatus',
  async () => {
    localStorage.removeItem('token');
    return null;
  }
); 