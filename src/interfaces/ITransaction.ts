// src/types/transaction.types.ts

export type TransactionType = 'add' | 'withdraw' | 'transfer' | 'cash-in' | 'cash-out';
export type TransactionStatus = 'pending' | 'completed' | 'reversed';

export interface ITransaction {
  type: TransactionType;
  from?: string;  
  to?: string;   
  amount: number;
  fee?: number;
  commission?: number;
  status?: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
