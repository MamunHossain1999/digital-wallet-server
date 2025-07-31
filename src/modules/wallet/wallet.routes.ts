import express from 'express';
import { addMoney, withdrawMoney, sendMoney, getWalletBalance, getAllWallets, blockWallet,  } from './wallet.controller';
import { verifyToken } from '../../middlewares/verifyToken';

const router = express.Router();

// 🔐 Routes with role-based token verification
router.get('/me', verifyToken(), getWalletBalance); //user nijer information dekhar jnno
router.get('/all', verifyToken(['admin']), getAllWallets); //all wallet aksathe dekhar jnno
router.post('/add-money', verifyToken(['user']), addMoney); //money add korar jnno
router.post('/withdraw', verifyToken(['user']), withdrawMoney); //money othanor jnno
router.post('/send-money', verifyToken(['user']), sendMoney);  //money pathanor jnno
router.patch('/block/:id', verifyToken(['admin']), blockWallet); //admin block korar jnno
export const walletRoutes = router;
