import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { IWallet, WalletStatus } from '../../interfaces/IWallet';

interface IWalletModel extends IWallet, Document {}

const walletSchema: Schema<IWalletModel> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 50 },
    status: { type: String, enum: ['active', 'blocked'] as WalletStatus[], default: 'active' },
    isBlocked: { type: Boolean, default: false } 
  },
  { timestamps: true }
);

const Wallet: Model<IWalletModel> = mongoose.model<IWalletModel>('Wallet', walletSchema);

export default Wallet;
