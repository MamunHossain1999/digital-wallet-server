import express from 'express';
import { verifyToken } from '../../middlewares/verifyToken';
import { getAdminDashboard } from './admin.controller';

const router = express.Router();

router.get('/dashboard', verifyToken(['admin']), getAdminDashboard);

export const adminRouter = router;
