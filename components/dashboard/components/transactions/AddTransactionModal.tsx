import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  RadioGroup,
  Radio,
  Card,
} from "@nextui-org/react";
import { useTransactionForm } from "../../hooks/useTransactionForm";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: {
    id: string;
    accountType: string;
    accountNumber: string;
  }[];
}

const AddTransactionModal = ({ isOpen, onClose, accounts }: AddTransactionModalProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    formData: { amount, description, selectedAccount, transactionType },
    setters: { setAmount, setDescription, setSelectedAccount, setTransactionType },
    isValid,
    handleSubmit: submitTransaction
  } = useTransactionForm(onClose);

  const handleSubmit = async () => {
    try {
      setErrorMessage(null); // Clear any previous errors
      await submitTransaction();
    } catch (error: any) {
      console.log('Error in modal:', error.message); // Add this for debugging
      setErrorMessage(error.message);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      backdrop="blur"
      onOpenChange={(open) => {
        if (!open) {
          setErrorMessage(null);
          onClose();
        }
      }}
    >
      <ModalContent>
        <ModalHeader>Add Transaction</ModalHeader>
        <ModalBody className="gap-4">
          {errorMessage && (
            <Card className="bg-danger-100 border-danger-800 p-3 text-center">
              <p className="text-danger-700 text-sm">{errorMessage}</p>
            </Card>
          )}
          <Input
            type="text"
            label="Amount"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            classNames={{
              input: "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            }}
            isRequired
          />
          <Input
            label="Description"
            placeholder="Transaction description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            isRequired
          />
          <RadioGroup
            label="Transaction Type"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <Radio value="deposit">Deposit</Radio>
            <Radio value="withdrawal">Withdrawal</Radio>
          </RadioGroup>
          <RadioGroup
            label="Select Account"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            isRequired
          >
            {accounts.map((account) => (
              <Radio key={account.id} value={account.id}>
                {`${account.accountType.toUpperCase()} ...${account.accountNumber.slice(-4)}`}
              </Radio>
            ))}
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isDisabled={!isValid}
          >
            Add Transaction
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTransactionModal;
