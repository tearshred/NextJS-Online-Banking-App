import { useState, useMemo } from 'react';
import { addTransaction } from '@/app/actions/transactions/addTransaction';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store/store';
import { fetchTransactions } from '@/app/store/transactionSlice';
import { useDashboard } from './useDashboard';

export const useTransactionForm = (onClose: () => void) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [transactionType, setTransactionType] = useState("deposit");
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useDashboard();

  // Validate amount input to only allow positive numbers
  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point - I totally used AI for this, cause who has time for regex?
    const regex = /^\d*\.?\d*$/;
    if (value === '' || regex.test(value)) {
      setAmount(value);
    }
  };

  /**
   * Uses useMemo to memorize the form validation result to prevent unnecessary recalculations
   * on every render. The validation only updates when its dependencies (amount, selectedAccount, 
   * or description) change.
   * 
   * Validation checks:
   * 1. amountValue >= 0.01        - Ensures amount is at least 1 cent
   * 2. !isNaN(amountValue)        - Verifies amount is a valid number
   * 3. selectedAccount !== ""     - Confirms an account has been selected
   * 4. description.trim() !== ""  - Ensures description is not empty or just whitespace
   * 
   * @returns {boolean} - True if all validation checks pass, false otherwise
   */
  const isValid = useMemo(() => {
    const amountValue = parseFloat(amount);
    return (
      amountValue >= 0.01 && 
      !isNaN(amountValue) && 
      selectedAccount !== "" && 
      description.trim() !== ""
    );
  }, [amount, selectedAccount, description]);

  const handleSubmit = async () => {
    try {
      if (!isValid) return;

      const result = await addTransaction({
        accountId: selectedAccount,
        amount: parseFloat(amount),
        description: description.trim(),
        transactionType: transactionType as 'deposit' | 'withdrawal'
      });

      if (result.error) {
        throw new Error(result.error);
      }
      
      resetForm();
      onClose();
    } catch (error: any) {
      throw error; // Propagate error to modal
    }
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setSelectedAccount("");
    setTransactionType("deposit");
  };

  return {
    formData: { amount, description, selectedAccount, transactionType },
    setters: { 
      setAmount: handleAmountChange, 
      setDescription, 
      setSelectedAccount, 
      setTransactionType 
    },
    isValid,
    handleSubmit,
    resetForm
  };
};
