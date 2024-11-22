import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
};

// Reusable types
export type User = {
  id: string;          
  email: string;       
  username: string;    
  firstName: string;   
  lastName: string;   
  address: string | null; 
  accounts: Account[]; // Relationship to Account
  emailVerified?: boolean;
};

export type Account = {
  id: string;          
  userId: string;      // References User id
  balance: number;     
  user?: User;         //Optional relationship to User
  accountType: string;  
  accountNumber: string;
  accountNickname?: string;
};

export type Transaction = {
  id: string;                     // Matches Prisma's id field type
  accountId: string;              // References Account id
  amount: number;                 // Matches Prisma's amount field type
  transactionType: string;        // Matches Prisma's transactionType field type
  description?: string;           // Optional description for the transaction
  date: Date;                     // Matches Prisma's date field type
  account?: Account;              // Optional relationship to Account
};

export type AccountSnapshot = {
  id: string;
  accountId: string;
  year: number;
  month: number;
  endingBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  transactionCount: number;
  createdAt: Date;
  account?: Account;
};

// Add more types as needed

export interface SignUpFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  address: string;
  initialDeposit: string;
}

export interface SignUpFormErrors {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  address: string;
  initialDeposit: string;
  general: string;
}
