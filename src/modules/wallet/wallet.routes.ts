import express from 'express';
import { addMoney, withdrawMoney, sendMoney, getWalletBalance, getAllWallets, blockWallet } from './wallet.controller';
import { verifyToken } from '../../middlewares/verifyToken';
import { authorizeRole } from '../../middlewares/authorizeRole';

const router = express.Router();

// 🔐 Routes
router.get('/my', verifyToken(), getWalletBalance); // user sees own wallet
router.get('/all', verifyToken(), authorizeRole(['admin']), getAllWallets); // admin sees all wallets
router.post('/add-money', verifyToken(), authorizeRole(['user']), addMoney); // user adds money
router.post('/withdraw', verifyToken(), authorizeRole(['user']), withdrawMoney); // user withdraws money
router.post('/send-money', verifyToken(), authorizeRole(['user']), sendMoney); // user sends money
router.patch('/block/:id', verifyToken(), authorizeRole(['admin']), blockWallet); // admin blocks wallet

export const walletRoutes = router;
