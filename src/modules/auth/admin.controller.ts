import { Request, Response } from 'express';

import Wallet from '../wallet/wallet.model';
import { User } from '../user/user.model';
import { Transaction } from '../transaction/transaction.model';
import { RequestWithUser } from '../../middlewares/verifyToken';


export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    // Verify role again (optional but safer)
    if ((req as any).user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }

    // Fetch all necessary data
    const users = await User.find({}, 'name email role status');
    const wallets = await Wallet.find({}, 'user balance isBlocked status');
    const transactions = await Transaction.find().sort({ createdAt: -1 }).limit(50); // latest 50

    res.status(200).json({
      usersCount: users.length,
      walletsCount: wallets.length,
      transactionsCount: transactions.length,
      users,
      wallets,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard', error });
  }
};


export const getAdminProfile = async (req: RequestWithUser, res: Response) => {
  try {
    const adminId = req.user?.userId;
    if (!adminId) return res.status(401).json({ message: "Unauthorized" });

    const admin = await User.findById(adminId).select("name email role status");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};