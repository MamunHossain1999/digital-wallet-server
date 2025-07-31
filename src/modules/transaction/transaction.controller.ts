
interface RequestWithUser extends Request {
  user?: {
    userId: string;
    role: string;
  };
}
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Wallet from '../wallet/wallet.model';
import { Transaction } from './transaction.model';


// wallet a money add kora 
export const topUp = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?._id;
  const { amount } = req.body;

//   console.log('Top-up request by user:', userId);
//   console.log('Requested amount:', amount);

  if (amount <= 0) throw new Error('Amount must be positive.');

  const wallet = await Wallet.findOne({ owner: userId });
  if (!wallet || wallet.isBlocked) throw new Error('Wallet not found or blocked.');

  const fee = 0;
  const netAmount = amount - fee;
  if(netAmount <= 0) throw new Error('Amount after fee must be positive.');

  wallet.balance += netAmount;
  await wallet.save();

  const trx = await Transaction.create({
    from: userId,
    amount: netAmount,
    fee: fee,
    type: 'add',
    status: 'completed',
  });

  console.log('Transaction saved:', trx);

  res.status(201).json({ message: 'Top-up successful', trx });
});


// wallet theke money withdraw kora 
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
    from: userId,
    amount,
    type: 'withdraw',
    status: 'completed',
  });

  res.status(201).json({ message: 'Withdraw successful', trx });
});


// wallet theke money send kora
export const sendMoney = asyncHandler(async (req: Request, res: Response) => {
  const senderId = (req as any).user?._id;
  const { receiverId, amount } = req.body;

  if (senderId === receiverId) throw new Error('Cannot send money to yourself.');
  if (amount <= 0) throw new Error('Amount must be positive.');

  const senderWallet = await Wallet.findOne({ owner: senderId });
  const receiverWallet = await Wallet.findOne({ owner: receiverId });

  if (!senderWallet || senderWallet.isBlocked) throw new Error('Sender wallet not found or blocked.');
  if (!receiverWallet || receiverWallet.isBlocked) throw new Error('Receiver wallet not found or blocked.');
  if (senderWallet.balance < amount) throw new Error('Insufficient balance.');

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;

  await senderWallet.save();
  await receiverWallet.save();

  const trx = await Transaction.create({
    from: senderId,
    to: receiverId,
    amount,
    type: 'transfer',
    status: 'completed',
  });

  res.status(201).json({ message: 'Money sent successfully', trx });
});


// transation history dekha
export const getMyTransactions = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?._id;

  const transactions = await Transaction.find({
    $or: [{ from: userId }, { to: userId }],
  }).sort({ createdAt: -1 });

  res.status(200).json({ transactions });
});


// admin er jnno show show kora
export const getAllTransactions = asyncHandler(async (req: RequestWithUser, res: Response) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Access denied: Admins only' });
    return;  
  }

  const transactions = await Transaction.find()
    .populate('from', 'email role')
    .populate('to', 'email role');

  res.status(200).json(transactions);
 
});

