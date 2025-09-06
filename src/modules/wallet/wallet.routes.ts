import express from 'express';
import { getWalletBalance, getAllWallets, blockWallet } from './wallet.controller';
import { topUp, withdraw, sendMoney } from '../transaction/transaction.controller';
import { verifyToken } from '../../middlewares/verifyToken';
import { authorizeRole } from '../../middlewares/authorizeRole';

const router = express.Router();

// 🔐 Routes
router.get('/my', verifyToken(['user', 'agent', 'admin']), getWalletBalance); // user sees own wallet
router.get('/all', verifyToken(['admin']), getAllWallets); // admin sees all wallets
router.post('/add-money', verifyToken(['user', 'agent', 'admin']), topUp); // user adds money
router.post('/withdraw', verifyToken(['user', 'agent', 'admin']), withdraw); // user withdraws money
router.post('/send-money', verifyToken(['user', 'agent', 'admin']), sendMoney); // user sends money
router.patch('/block/:id', verifyToken(['admin']), blockWallet); // admin blocks wallet

export const walletRoutes = router;
