import express from 'express';
import { addMoney, withdrawMoney, sendMoney } from './wallet.controller';
import { verifyToken } from '../../middlewares/verifyToken';

const router = express.Router();

// 🔐 Routes with role-based token verification
router.post('/add-money', verifyToken(['user']), addMoney);
router.post('/withdraw', verifyToken(['user']), withdrawMoney);
router.post('/send-money', verifyToken(['user']), sendMoney);

export const walletRoutes = router;
