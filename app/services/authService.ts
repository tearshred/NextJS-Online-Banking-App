import { loginAction } from "../actions/auth/login";
import { validateToken } from "@/app/actions/auth/validateToken";
import { AppDispatch } from "@/app/store/store";
import { loginUser, logoutUser } from "@/app/store/authSlice";
import { fetchAccounts } from "@/app/store/accountSlice";
import { User } from "@/types";
import { getUserData } from "@/app/actions/users/userData";

export const authService = {
  initializeAuth: async (dispatch: AppDispatch) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const { isValid, userData } = await validateToken(token);
      
      if (isValid && userData) {
        const completeUserData = await getUserData(userData.userId);

        const mappedUserData: User = {
          id: completeUserData.id,
          email: completeUserData.email,
          username: completeUserData.username,
          firstName: completeUserData.firstName,
          lastName: completeUserData.lastName,
          address: completeUserData.address || null,
           // Map over user's accounts array if it exists (?.); 
           // if accounts is undefined, use empty array (|| [])
          accounts: completeUserData.accounts?.map(account => ({
            // Spread all existing account properties into the new object
            ...account,
            // Add userId to each account, linking it to the parent user
            userId: completeUserData.id,
            // Set accountNumber using a fallback pattern:
            // 1. Try to get accountNumber (using 'any' to bypass TypeScript checking)
            // 2. If that doesn't exist, fall back to account.id
            accountNumber: (account as any).accountNumber || account.id,
            // Complex createdAt handling:
            // 1. Use 'any' to bypass TypeScript property check
            // *** IMPORTANT LEARNING POINT ***
            // * The (account as any) type assertions are used because the account type definition doesn't include these properties, 
            // but we know they might exist at runtime. This is a common pattern when dealing with data that might come from an API 
            // or database where the TypeScript types don't perfectly match the runtime data structure.
            // 2. Check if createdAt is a Date object
            // 3. If it is a Date, convert to ISO string format
            // 4. If it's not a Date, use the raw createdAt value
            // 5. If createdAt doesn't exist at all, fall back to null (?? null)
            createdAt: (account as any).createdAt instanceof Date ? (account as any).createdAt.toISOString() : (account as any).createdAt ?? null
          })) || []
        };

        await dispatch(loginUser({ userData: mappedUserData, token })).unwrap();
        dispatch(fetchAccounts(userData.userId));
        return true;
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
    }
    return false;
  },

  login: async (dispatch: AppDispatch, username: string, password: string) => {
    try {
      // console.log('Starting login process...');
      const response = await loginAction(username, password);
      // console.log('Login response:', response);
      
      if (!response.success) {
        // console.log('Login failed:', response.error);
        return {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: response.error?.message || 'Username not found'
          }
        };
      }
      
      if (!response.data) {
        throw new Error('Login response data is missing');
      }
      
      // console.log('Login successful, setting up user...');
      localStorage.setItem("token", response.data.token);
      
      const userData: User = {
        id: response.data.userData.id,
        email: response.data.userData.email,
        username: response.data.userData.username,
        firstName: response.data.userData.firstName,
        lastName: response.data.userData.lastName,
        address: response.data.userData.address || null,
        accounts: []
      };

      await dispatch(loginUser({
        userData,
        token: response.data.token,
      })).unwrap();

      dispatch(fetchAccounts(response.data.userData.id));
      return { success: true };
      
    } catch (error) {
      // console.error('Login error:', error);
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'An unexpected error occurred'
        }
      };
    }
  },

  logout: async (dispatch: AppDispatch) => {
    try {
      localStorage.removeItem("token");
      await dispatch(logoutUser()).unwrap();
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  }
}; 