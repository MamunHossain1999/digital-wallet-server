import express from 'express';
import { addMoney, withdrawMoney, sendMoney, getWalletBalance, getAllWallets } from './wallet.controller';
import { verifyToken } from '../../middlewares/verifyToken';

const router = express.Router();

// 🔐 Routes with role-based token verification
router.get('/me', verifyToken(), getWalletBalance);
router.get('/all', verifyToken(['admin']), getAllWallets);
router.post('/add-money', verifyToken(['user']), addMoney);
router.post('/withdraw', verifyToken(['user']), withdrawMoney);
router.post('/send-money', verifyToken(['user']), sendMoney);

export const walletRoutes = router;
