import { checkAvailabilityAction } from "../actions/auth/checkAvailability";

export const validationService = {
  checkAvailability: async (field: 'email' | 'username', value: string) => {
    try {
      const result = await checkAvailabilityAction(field, value);
      return {
        available: result.available,
        message: result.message
      };
    } catch (error) {
      console.error(`Validation service error checking ${field}:`, error);
      return {
        available: false,
        message: "Error checking availability"
      };
    }
  }
}; 