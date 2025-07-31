// src/models/transaction.model.ts

import { Schema, model } from 'mongoose';
import { ITransaction } from '../../interfaces/ITransaction';


const transactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: ['add', 'withdraw', 'transfer', 'cash-in', 'cash-out'],
      required: true,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
    },
    fee: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'reversed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = model<ITransaction>('Transaction', transactionSchema);
