import express from "express";
import { topUp, withdraw, sendMoney, getMyTransactions, getAllTransactions, cashIn, cashOut } from "./transaction.controller";
import { verifyToken } from "../../middlewares/verifyToken";

const router = express.Router();

router.post("/top-up", verifyToken(["user","agent","admin"]), topUp);
router.post("/withdraw", verifyToken(["user","agent","admin"]), withdraw);
router.post("/send", verifyToken(["user","agent","admin"]), sendMoney);
router.get("/history", verifyToken(["user","agent","admin"]), getMyTransactions);
router.get("/admin", verifyToken(["admin"]), getAllTransactions);

// Agent-specific routes
router.post("/cash-in", verifyToken(["agent"]), cashIn);
router.post("/cash-out", verifyToken(["agent"]), cashOut);

export const AuthTransaction = router;