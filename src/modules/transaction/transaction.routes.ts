import { AuthRoutes } from './../auth/auth.route';
import express from 'express';
import { topUp, withdraw, sendMoney } from './transaction.controller';
import { verifyToken } from '../../middlewares/verifyToken';

const router = express.Router();

router.post('/top-up', verifyToken, topUp);
router.post('/withdraw', verifyToken, withdraw);
router.post('/send', verifyToken, sendMoney);

export const AuthTransation = router;
