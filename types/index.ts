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
  address: string; 
  accounts: Account[]; // Relationship to Account
};

export type Account = {
  id: string;          
  userId: string;      // References User id
  balance: number;     
  user?: User;         //Optional relationship to User
  accountType: string;      
};

export type Transaction = {
  id: string;                     // Matches Prisma's id field type
  accountId: string;              // References Account id
  amount: number;                 // Matches Prisma's amount field type
  transactionType: string;        // Matches Prisma's transactionType field type
  date: Date;                     // Matches Prisma's date field type
  account?: Account;              // Optional relationship to Account
};

// Add more types as needed
