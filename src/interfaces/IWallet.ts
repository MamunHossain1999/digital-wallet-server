import { Types } from 'mongoose';

export type WalletStatus = 'active' | 'blocked';

export interface IWallet {
  user: string | Types.ObjectId;  
  balance: number;
  status?: WalletStatus;
  isBlocked?: boolean; 
  createdAt?: Date;
  updatedAt?: Date;
}
