import { Request, Response } from 'express';
import Wallet from '../wallet/wallet.model';
import Transaction from './transaction.model';
import asyncHandler from 'express-async-handler';
// import { Transaction } from './transaction.model';
// import { Wallet } from '../wallet/wallet.model';

// Top-up
export const topUp = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?._id;
  const { amount } = req.body;

  if (amount <= 0) throw new Error('Amount must be positive.');

  const wallet = await Wallet.findOne({ owner: userId });
  if (!wallet || wallet.isBlocked) throw new Error('Wallet not found or blocked.');

  wallet.balance += amount;
  await wallet.save();

  const trx = await Transaction.create({
    sender: userId,
    amount,
    type: 'TOP_UP',
    status: 'COMPLETED',
  });

  res.status(201).json({ message: 'Top-up successful', trx });
});

// Withdraw
export const withdraw = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?._id;
  const { amount } = req.body;

  if (amount <= 0) throw new Error('Amount must be positive.');

  const wallet = await Wallet.findOne({ owner: userId });
  if (!wallet || wallet.isBlocked) throw new Error('Wallet not found or blocked.');
  if (wallet.balance < amount) throw new Error('Insufficient balance.');

  wallet.balance -= amount;
  await wallet.save();

  const trx = await Transaction.create({
    sender: userId,
    amount,
    type: 'WITHDRAW',
    status: 'COMPLETED',
  });

  res.status(201).json({ message: 'Withdraw successful', trx });
});

// Send Money
export const sendMoney = asyncHandler(async (req: Request, res: Response) => {
  const senderId = (req as any).user?._id;
  const { receiverId, amount } = req.body;

  if (senderId === receiverId) throw new Error('Cannot send to self.');
  if (amount <= 0) throw new Error('Amount must be positive.');

  const senderWallet = await Wallet.findOne({ owner: senderId });
  const receiverWallet = await Wallet.findOne({ owner: receiverId });

  if (!senderWallet || senderWallet.isBlocked) throw new Error('Sender wallet not found or blocked.');
  if (!receiverWallet || receiverWallet.isBlocked) throw new Error('Receiver wallet not found or blocked.');
  if (senderWallet.balance < amount) throw new Error('Insufficient balance.');

  // Transaction
  senderWallet.balance -= amount;
  receiverWallet.balance += amount;
  await senderWallet.save();
  await receiverWallet.save();

  const trx = await Transaction.create({
    sender: senderId,
    receiver: receiverId,
    amount,
    type: 'SEND',
    status: 'COMPLETED',
  });

  res.status(201).json({ message: 'Send successful', trx });
});
