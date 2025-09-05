"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTransaction = void 0;
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("./transaction.controller");
const verifyToken_1 = require("../../middlewares/verifyToken");
const router = express_1.default.Router();
router.post("/top-up", (0, verifyToken_1.verifyToken)(["user", "agent", "admin"]), transaction_controller_1.topUp);
router.post("/withdraw", (0, verifyToken_1.verifyToken)(["user", "agent", "admin"]), transaction_controller_1.withdraw);
router.post("/send", (0, verifyToken_1.verifyToken)(["user", "agent", "admin"]), transaction_controller_1.sendMoney);
router.get("/history", (0, verifyToken_1.verifyToken)(["user", "agent", "admin"]), transaction_controller_1.getMyTransactions);
router.get("/admin", (0, verifyToken_1.verifyToken)(["admin"]), transaction_controller_1.getAllTransactions);
exports.AuthTransaction = router;
