
interface RequestWithUser extends Request {
  user?: {
    userId: string;
    role: string;
  };
}
import { NextFunction, Request, Response } from 'express';
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
  } catch (error) {
    console.error('Send money error:', error);
    throw error;
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

// Agent cash-in: Add money to any user's wallet

export const cashIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const agentId = (req as any).user?.userId;
    const agentRole = (req as any).user?.role;
    const { userEmail, amount } = req.body;

    if (agentRole !== "agent") {
      res
        .status(403)
        .json({ message: "Only agents can perform cash-in operations" });
      return;
    }

    if (!userEmail || !amount || amount <= 0) {
      res
        .status(400)
        .json({ message: "Valid user email and positive amount required" });
      return;
    }

    const targetUser = await User.findOne({ email: userEmail });
    if (!targetUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const targetWallet = await Wallet.findOne({ user: targetUser._id });
    if (!targetWallet || targetWallet.status === "blocked") {
      res.status(403).json({ message: "Target wallet not found or blocked" });
      return;
    }

    const agentWallet = await Wallet.findOne({ user: agentId });
    if (!agentWallet || agentWallet.status === "blocked") {
      res.status(403).json({ message: "Agent wallet not found or blocked" });
      return;
    }

    // Commission calculation (2% for cash-in)
    const commission = amount * 0.02;
    const netAmount = amount - commission;

    if (agentWallet.balance < amount) {
      res.status(400).json({ message: "Insufficient agent balance" });
      return;
    }

    // Use database transaction for atomic operations
    const session = await Wallet.startSession();

    try {
      await session.withTransaction(async () => {
        // Deduct from agent wallet
        agentWallet.balance -= amount;
        await agentWallet.save({ session });

        // Add to user wallet (minus commission)
        targetWallet.balance += netAmount;
        await targetWallet.save({ session });

        // Create transaction record
        await Transaction.create(
          [
            {
              from: agentId,
              to: targetUser._id,
              amount: netAmount,
              fee: commission,
              commission: commission,
              type: "cash-in",
              status: "completed",
            },
          ],
          { session }
        );
      });

      res.status(201).json({
        message: "Cash-in successful",
        amount: netAmount,
        commission: commission,
        targetUser: targetUser.email,
      });
    } finally {
      await session.endSession();
    }
  }
);

// Agent cash-out: Withdraw money from any user's wallet

export const cashOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const agentId = (req as any).user?.userId;
    const agentRole = (req as any).user?.role;
    const { userEmail, amount } = req.body;

    if (agentRole !== "agent") {
      res
        .status(403)
        .json({ message: "Only agents can perform cash-out operations" });
      return;
    }

    if (!userEmail || !amount || amount <= 0) {
      res
        .status(400)
        .json({ message: "Valid user email and positive amount required" });
      return;
    }

    const targetUser = await User.findOne({ email: userEmail });
    if (!targetUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const targetWallet = await Wallet.findOne({ user: targetUser._id });
    if (!targetWallet || targetWallet.status === "blocked") {
      res
        .status(403)
        .json({ message: "Target wallet not found or blocked" });
      return;
    }

    const agentWallet = await Wallet.findOne({ user: agentId });
    if (!agentWallet || agentWallet.status === "blocked") {
      res.status(403).json({ message: "Agent wallet not found or blocked" });
      return;
    }

    // Commission calculation (1.5% for cash-out)
    const commission = amount * 0.015;
    const totalDeduction = amount + commission;

    if (targetWallet.balance < totalDeduction) {
      res
        .status(400)
        .json({ message: "Insufficient user balance (including commission)" });
      return;
    }

    // Use database transaction for atomic operations
    const session = await Wallet.startSession();

    try {
      await session.withTransaction(async () => {
        // Deduct from user wallet (amount + commission)
        targetWallet.balance -= totalDeduction;
        await targetWallet.save({ session });

        // Add to agent wallet
        agentWallet.balance += amount;
        await agentWallet.save({ session });

        // Create transaction record
        await Transaction.create(
          [
            {
              from: targetUser._id,
              to: agentId,
              amount: amount,
              fee: commission,
              commission: commission,
              type: "cash-out",
              status: "completed",
            },
          ],
          { session }
        );
      });

      res.status(201).json({
        message: "Cash-out successful",
        amount: amount,
        commission: commission,
        targetUser: targetUser.email,
      });
    } finally {
      await session.endSession();
    }
  }
);

