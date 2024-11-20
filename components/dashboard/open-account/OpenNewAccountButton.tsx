import React, { useState } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";

const ACCOUNT_TYPES = [
  {
    type: 'checking',
    title: 'Checking',
    description: 'Perfect for daily transactions and bill payments',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M7 15h10M3 10h18" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  },
  {
    type: 'savings',
    title: 'Savings',
    description: 'Earn interest on your deposits',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  },
  {
    type: 'brokerage',
    title: 'Brokerage',
    description: 'Invest in stocks, bonds, and more',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17l5-5 4 4 8-8M14 7h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
];

const OpenNewAccountButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <>
      <Button 
        color="primary"
        radius="full"
        className="font-medium"
        onPress={() => setIsOpen(true)}
        startContent={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        }
      >
        Open New Account
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => {
          setIsOpen(false);
          setSelectedType(null);
        }}
        size="2xl"
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader className="text-xl font-bold flex items-center gap-3">
            {selectedType && (
              <Button
                isIconOnly
                color="primary"
                variant="light"
                radius="full"
                className="min-w-8 w-8 h-8"
                onPress={() => setSelectedType(null)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M15 18l-6-6 6-6" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            )}
            Select Account Type
          </ModalHeader>
          <ModalBody className="pb-6">
            {!selectedType ? (
              <div className="grid md:grid-cols-3 gap-4">
                {ACCOUNT_TYPES.map((account) => (
                  <Card key={account.type} shadow="sm" className="p-3">
                    <CardHeader className="flex-col items-center pb-0">
                      <div className="text-primary">{account.icon}</div>
                      <h3 className="text-lg font-semibold">{account.title}</h3>
                    </CardHeader>
                    <CardBody className="py-2">
                      <p className="text-sm text-default-500">{account.description}</p>
                    </CardBody>
                    <CardFooter>
                      <Button 
                        color="primary" 
                        className="w-full"
                        variant="flat"
                        onPress={() => setSelectedType(account.type)}
                      >
                        Select
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">
                  {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Account
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Account Nickname</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border border-default-200 focus:border-primary focus:outline-none"
                      placeholder="e.g., My Savings"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Initial Deposit ($)</label>
                    <input 
                      type="number"
                      className="w-full px-3 py-2 rounded-lg border border-default-200 focus:border-primary focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0.00"
                      min="0"
                    />
                  </div>
                </div>
                <Button 
                  color="primary"
                  className="w-full"
                >
                  Create Account
                </Button>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OpenNewAccountButton;