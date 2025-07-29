import { Types } from 'mongoose';

export type WalletStatus = 'active' | 'blocked';

export interface IWallet {
  user: string | Types.ObjectId;  
  balance: number;
   isBlocked?: boolean; 
  status?: WalletStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
