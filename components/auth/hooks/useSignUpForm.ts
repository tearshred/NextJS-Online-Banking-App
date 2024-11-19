import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/app/store/store';
import { registerUser } from '@/app/store/signUpSlice';
import { authService } from '@/app/services/authService';
import { validationService } from '@/app/services/validationService';
import debounce from 'lodash/debounce';
import { SignUpFormData, SignUpFormErrors } from '@/types';
import { validateEmail, validateUsername, validatePassword, validateCredentialsTab, validatePersonalInfoTab } from '../utils/validation';

const initialFormData: SignUpFormData = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  address: "",
  initialDeposit: "0",
};

const initialErrors: SignUpFormErrors = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  address: "",
  initialDeposit: "",
  general: "",
};

// Custom hook managing sign-up form state and logic:
// - Form data and error state management
// - Real-time field validation
// - Async validation for email/username availability
// - Form submission handling
// - Navigation after successful registration
export const useSignUpForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData);
  const [errors, setErrors] = useState<SignUpFormErrors>(initialErrors);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isChecking, setIsChecking] = useState({
    email: false,
    username: false
  });

  useEffect(() => {
    const isCredentialsValid = validateCredentialsTab(formData, errors);
    const isPersonalValid = validatePersonalInfoTab(formData);
    
    setIsFormValid(isCredentialsValid && isPersonalValid);
  }, [formData, errors]);

  const checkFieldAvailability = useCallback(
    debounce(async (field: 'email' | 'username', value: string) => {
      if (!value) return;

      setIsChecking(prev => ({ ...prev, [field]: true }));
      
      const result = await validationService.checkAvailability(field, value);
      
      setIsChecking(prev => ({ ...prev, [field]: false }));
      
      if (!result.available) {
        setErrors(prev => ({
          ...prev,
          [field]: result.message
        }));
        setIsNextEnabled(false);
      }
    }, 500),
    []
  );

  const handleInputChange = (field: keyof SignUpFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "", general: "" }));

    // Field-specific validation
    switch (field) {
      case 'email':
        if (validateEmail(value)) {
          checkFieldAvailability('email', value);
        } else {
          setErrors(prev => ({
            ...prev,
            email: "Please enter a valid email address"
          }));
          setIsNextEnabled(false);
        }
        break;

      case 'username':
        if (validateUsername(value)) {
          checkFieldAvailability('username', value);
        } else {
          setErrors(prev => ({
            ...prev,
            username: "Username must be at least 3 characters and contain only letters, numbers, and underscores"
          }));
          setIsNextEnabled(false);
        }
        break;

      case 'password':
        if (!validatePassword(value)) {
          setErrors(prev => ({
            ...prev,
            password: "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character"
          }));
          setIsNextEnabled(false);
        } else if (formData.confirmPassword && value !== formData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: "Passwords do not match"
          }));
          setIsNextEnabled(false);
        }
        break;

      case 'confirmPassword':
        if (value !== formData.password) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: "Passwords do not match"
          }));
          setIsNextEnabled(false);
        }
        break;
    }

    // Update next button state
    const updatedFormData = { ...formData, [field]: value };
    const isValid = validateCredentialsTab(updatedFormData, errors);
    setIsNextEnabled(isValid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { confirmPassword, initialDeposit, ...registerData } = formData;
      
      const registrationData = {
        email: registerData.email,
        username: registerData.username,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        address: registerData.address || null,
        initialBalance: parseFloat(initialDeposit) || 0
      };

      await dispatch(registerUser(registrationData)).unwrap();
      
      setIsSuccess(true);
      
      setTimeout(async () => {
        await authService.login(
          dispatch,
          registrationData.username,
          registrationData.password
        );
        router.push("/");
      }, 2000);
      
    } catch (error: any) {
      setErrors(prev => ({
        ...prev,
        general: error.message || 'Registration failed'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    isSuccess,
    isNextEnabled,
    isFormValid,
    isChecking,
    handleInputChange,
    handleSubmit,
  };
};
