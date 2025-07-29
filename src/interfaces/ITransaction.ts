export type TransactionType = 'add' | 'withdraw' | 'transfer' | 'cash-in' | 'cash-out';
export type TransactionStatus = 'pending' | 'completed' | 'reversed';

export interface ITransaction {
  type: TransactionType;
  from?: string; // user id
  to?: string;   // user id
  amount: number;
  fee?: number;
  commission?: number;
  status?: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
