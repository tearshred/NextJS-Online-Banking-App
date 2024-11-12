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
          accounts: completeUserData.accounts?.map(account => ({
            ...account,
            createdAt: account.createdAt instanceof Date ? account.createdAt.toISOString() : account.createdAt
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
    const response = await loginAction(username, password);
    
    if (response.success && response.data) {
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
      return true;
    }
    return false;
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