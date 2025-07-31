import { Request, Response } from 'express';
import Wallet from './wallet.model';
import { RequestWithUser } from '../../middlewares/verifyToken';
import { Transaction } from '../transaction/transaction.model';
interface BlockWalletRequestBody {
  block: boolean;
}

// money add korar jnno
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

export const getWalletBalance = async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.user?.userId;
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.status(200).json({ balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export const getAllWallets = async (req: RequestWithUser, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const wallets = await Wallet.find().populate('user', 'name email role'); // optional: populate user info
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};


export const blockWallet = async (
  req: Request<{ id: string }, any, BlockWalletRequestBody>,
  res: Response
) => {
  try {
    const walletId = req.params.id;
    const { block } = req.body;

    if (typeof block !== "boolean") {
      return res
        .status(400)
        .json({ message: "Block status (boolean) is required in body" });
    }

    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    wallet.isBlocked = block;
    await wallet.save();

    res.status(200).json({
      message: `Wallet ${block ? "blocked" : "unblocked"} successfully`,
      wallet,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};