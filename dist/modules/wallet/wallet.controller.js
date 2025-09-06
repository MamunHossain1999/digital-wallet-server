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
exports.blockWallet = exports.getAllWallets = exports.getWalletBalance = exports.sendMoney = exports.withdrawMoney = exports.addMoney = void 0;
const wallet_model_1 = __importDefault(require("./wallet.model"));
const transaction_model_1 = require("../transaction/transaction.model");
const mongoose_1 = __importDefault(require("mongoose"));
// money add korar jnno
const addMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { amount } = req.body;
        if (!amount || amount <= 0)
            return res.status(400).json({ message: 'Invalid amount' });
        const wallet = yield wallet_model_1.default.findOne({ user: userId });
        if (!wallet)
            return res.status(404).json({ message: 'Wallet not found' });
        if (wallet.status === 'blocked')
            return res.status(403).json({ message: 'Wallet is blocked' });
        wallet.balance += amount;
        yield wallet.save();
        yield transaction_model_1.Transaction.create({ type: 'add', from: userId, amount, status: 'completed' });
        res.json({ message: 'Money added successfully', balance: wallet.balance });
    }
    catch (error) {
        console.error('Add money error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
exports.addMoney = addMoney;
// money withdraw korar jnno
const withdrawMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { amount } = req.body;
        if (!amount || amount <= 0)
            return res.status(400).json({ message: 'Invalid amount' });
        const wallet = yield wallet_model_1.default.findOne({ user: userId });
        if (!wallet)
            return res.status(404).json({ message: 'Wallet not found' });
        if (wallet.status === 'blocked')
            return res.status(403).json({ message: 'Wallet is blocked' });
        if (wallet.balance < amount)
            return res.status(400).json({ message: 'Insufficient balance' });
        wallet.balance -= amount;
        yield wallet.save();
        yield transaction_model_1.Transaction.create({ type: 'withdraw', from: userId, amount, status: 'completed' });
        res.json({ message: 'Money withdrawn successfully', balance: wallet.balance });
    }
    catch (error) {
        console.error('Withdraw money error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
exports.withdrawMoney = withdrawMoney;
// onnno user er kase money send korar jnno - DEPRECATED: Use transaction.controller.ts sendMoney instead
const sendMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(410).json({
        message: 'This endpoint is deprecated. Use /api/transaction/send-money instead.',
        redirectTo: '/api/transaction/send-money'
    });
});
exports.sendMoney = sendMoney;
// nijer waller sk sathe dekhar jnno
const getWalletBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const wallet = yield wallet_model_1.default.findOne({ user: userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        res.status(200).json({ balance: wallet.balance });
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
});
exports.getWalletBalance = getWalletBalance;
// sob waller sk sathe dekhar jnno
const getAllWallets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
        const wallets = yield wallet_model_1.default.find().populate('user', 'name email role'); // optional: populate user info
        res.status(200).json(wallets);
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
});
exports.getAllWallets = getAllWallets;
// admin block unblock korar jnno
const blockWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const walletId = req.params.id;
        const { block } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(walletId)) {
            return res.status(400).json({ message: "Invalid wallet ID" });
        }
        if (typeof block !== "boolean") {
            return res
                .status(400)
                .json({ message: "Block status (boolean) is required in body" });
        }
        const wallet = yield wallet_model_1.default.findById(walletId);
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        wallet.isBlocked = block;
        wallet.status = block ? 'blocked' : 'active';
        yield wallet.save();
        res.status(200).json({
            message: `Wallet ${block ? "blocked" : "unblocked"} successfully`,
            wallet,
        });
    }
    catch (error) {
        console.error("Block wallet error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});
exports.blockWallet = blockWallet;
