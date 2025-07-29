import mongoose, { Document, Schema, Model } from 'mongoose';
import { ITransaction, TransactionType, TransactionStatus } from '../../interfaces/ITransaction';

interface ITransactionModel extends ITransaction, Document {}

const transactionSchema: Schema<ITransactionModel> = new Schema(
  {
    type: {
      type: String,
      enum: ['add', 'withdraw', 'transfer', 'cash-in', 'cash-out'] as TransactionType[],
      required: true,
    },
    from: { type: Schema.Types.ObjectId, ref: 'User' }, // যিনি পাঠাচ্ছেন
    to: { type: Schema.Types.ObjectId, ref: 'User' },   // যিনি পাচ্ছেন
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'completed', 'reversed'] as TransactionStatus[],
      default: 'completed',
    },
  },
  { timestamps: true }
);

const Transaction: Model<ITransactionModel> = mongoose.model<ITransactionModel>('Transaction', transactionSchema);

export default Transaction;
