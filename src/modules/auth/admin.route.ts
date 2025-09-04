import express from 'express';
import { verifyToken } from '../../middlewares/verifyToken';
import { getAdminDashboard, getAdminProfile } from './admin.controller';
import { authenticate } from '../../middlewares/authenticate';
import { isAdmin } from '../../middlewares/isAdmin';
import { getAllUsers } from './user.controller';

const router = express.Router();

router.get('/dashboard', verifyToken(['admin']), getAdminDashboard);
router.get("/all", authenticate, isAdmin, getAllUsers);
// admin.routes.ts
router.get("/me", verifyToken(["admin"]), getAdminProfile);

export const adminRouter = router;
