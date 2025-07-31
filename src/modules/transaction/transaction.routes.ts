
import express from 'express';
import { topUp, withdraw, sendMoney, getMyTransactions, getAllTransactions } from './transaction.controller';
import { verifyToken } from '../../middlewares/verifyToken';

const router = express.Router();

router.post('/top-up', verifyToken(['user', 'agent', 'admin']), topUp); //wallet a money add 
router.post('/withdraw', verifyToken(['user', 'agent', 'admin']), withdraw); //wallet theke money uthano
router.post('/send', verifyToken(['user', 'agent', 'admin']), sendMoney); // wallet theke money send kora
router.get('/history', verifyToken(['user', 'agent', 'admin']), getMyTransactions); // money transation history show kora 
router.get('/admin', verifyToken(['admin']), getAllTransactions); //admin sob kisu dekha ba manage kora

export const AuthTransation = router;
