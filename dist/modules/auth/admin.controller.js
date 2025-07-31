"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboard = void 0;
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
const user_model_1 = require("../user/user.model");
const transaction_model_1 = require("../transaction/transaction.model");
const getAdminDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify role again (optional but safer)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin only' });
        }
        // Fetch all necessary data
        const users = yield user_model_1.User.find({}, 'name email role status');
        const wallets = yield wallet_model_1.default.find({}, 'user balance isBlocked status');
        const transactions = yield transaction_model_1.Transaction.find().sort({ createdAt: -1 }).limit(50); // latest 50
        res.status(200).json({
            usersCount: users.length,
            walletsCount: wallets.length,
            transactionsCount: transactions.length,
            users,
            wallets,
            transactions,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to load dashboard', error });
    }
});
exports.getAdminDashboard = getAdminDashboard;
