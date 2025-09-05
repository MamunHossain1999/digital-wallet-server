
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
import { User } from '../user/user.model';


// wallet a money add kora 
export const topUp = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { amount } = req.body;

  console.log('Top-up request by user:', userId);
  console.log('Requested amount:', amount);

  if (amount <= 0) throw new Error('Amount must be positive.');

  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet || wallet.status === 'blocked') throw new Error('Wallet not found or blocked.');

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
  const userId = (req as any).user?.userId;
  const { amount } = req.body;

  if (amount <= 0) throw new Error('Amount must be positive.');

  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet || wallet.status === 'blocked') throw new Error('Wallet not found or blocked.');
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
  const senderId = (req as any).user?.userId;
  const { email, amount } = req.body;

  if (!email) throw new Error("Receiver email required");
  if (amount <= 0) throw new Error('Amount must be positive.');

  const receiverUser = await User.findOne({ email: email });
  if (!receiverUser) throw new Error("Receiver not found");

  if (receiverUser._id.toString() === senderId) throw new Error('Cannot send money to yourself');

  // Use database transaction for atomic operations
  const session = await Wallet.startSession();
  
  try {
    await session.withTransaction(async () => {
      const senderWallet = await Wallet.findOne({ user: senderId }).session(session);
      const receiverWallet = await Wallet.findOne({ user: receiverUser._id }).session(session);

      if (!senderWallet || senderWallet.status === 'blocked') throw new Error('Sender wallet not found or blocked.');
      if (!receiverWallet || receiverWallet.status === 'blocked') throw new Error('Receiver wallet not found or blocked.');
      if (senderWallet.balance < amount) throw new Error('Insufficient balance.');

      senderWallet.balance -= amount;
      receiverWallet.balance += amount;

      await senderWallet.save({ session });
      await receiverWallet.save({ session });

      await Transaction.create([{
        from: senderId,
        to: receiverUser._id,
        amount,
        type: 'transfer',
        status: 'completed',
      }], { session });
    });

    res.status(201).json({ message: 'Money sent successfully' });
  } finally {
    await session.endSession();
  }
});



// transation history dekha
export const getMyTransactions = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;

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

