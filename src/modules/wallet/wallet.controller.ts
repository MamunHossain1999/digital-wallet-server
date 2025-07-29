import { Request, Response } from 'express';
import Wallet from './wallet.model';
import Transaction from '../transaction/transaction.model';
import { RequestWithUser } from '../../middlewares/verifyToken';

export const addMoney = async (req: RequestWithUser, res: Response) => {
  const userId = req.user?.userId;
  const { amount } = req.body;

  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
  if (wallet.status === 'blocked') return res.status(403).json({ message: 'Wallet is blocked' });

  wallet.balance += amount;
  await wallet.save();

  await Transaction.create({ type: 'add', from: userId, amount, status: 'completed' });

  res.json({ message: 'Money added successfully', balance: wallet.balance });
};

export const withdrawMoney = async (req: RequestWithUser, res: Response) => {
  const userId = req.user?.userId;
  const { amount } = req.body;

  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
  if (wallet.status === 'blocked') return res.status(403).json({ message: 'Wallet is blocked' });

  if (wallet.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

  wallet.balance -= amount;
  await wallet.save();

  await Transaction.create({ type: 'withdraw', from: userId, amount, status: 'completed' });

  res.json({ message: 'Money withdrawn successfully', balance: wallet.balance });
};

export const sendMoney = async (req: RequestWithUser, res: Response) => {
  const senderId = req.user?.userId;
  const { receiverId, amount } = req.body;

  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
  if (!receiverId) return res.status(400).json({ message: 'Receiver ID is required' });
  if (receiverId === senderId) return res.status(400).json({ message: 'Cannot send money to self' });

  const senderWallet = await Wallet.findOne({ user: senderId });
  const receiverWallet = await Wallet.findOne({ user: receiverId });

  if (!senderWallet || !receiverWallet) return res.status(404).json({ message: 'Wallet not found' });
  if (senderWallet.status === 'blocked' || receiverWallet.status === 'blocked')
    return res.status(403).json({ message: 'Wallet is blocked' });

  if (senderWallet.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;

  await senderWallet.save();
  await receiverWallet.save();

  await Transaction.create({ type: 'transfer', from: senderId, to: receiverId, amount, status: 'completed' });

  res.json({ message: 'Money sent successfully', senderBalance: senderWallet.balance });
};
