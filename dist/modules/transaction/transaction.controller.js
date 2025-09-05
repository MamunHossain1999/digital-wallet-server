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
exports.getAllTransactions = exports.getMyTransactions = exports.sendMoney = exports.withdraw = exports.topUp = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
const transaction_model_1 = require("./transaction.model");
const user_model_1 = require("../user/user.model");
// wallet a money add kora 
exports.topUp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { amount } = req.body;
    console.log('Top-up request by user:', userId);
    console.log('Requested amount:', amount);
    if (amount <= 0)
        throw new Error('Amount must be positive.');
    const wallet = yield wallet_model_1.default.findOne({ user: userId });
    if (!wallet || wallet.isBlocked)
        throw new Error('Wallet not found or blocked.');
    const fee = 0;
    const netAmount = amount - fee;
    if (netAmount <= 0)
        throw new Error('Amount after fee must be positive.');
    wallet.balance += netAmount;
    yield wallet.save();
    const trx = yield transaction_model_1.Transaction.create({
        from: userId,
        amount: netAmount,
        fee: fee,
        type: 'add',
        status: 'completed',
    });
    console.log('Transaction saved:', trx);
    res.status(201).json({ message: 'Top-up successful', trx });
}));
// wallet theke money withdraw kora 
exports.withdraw = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { amount } = req.body;
    if (amount <= 0)
        throw new Error('Amount must be positive.');
    const wallet = yield wallet_model_1.default.findOne({ user: userId });
    if (!wallet || wallet.isBlocked)
        throw new Error('Wallet not found or blocked.');
    if (wallet.balance < amount)
        throw new Error('Insufficient balance.');
    wallet.balance -= amount;
    yield wallet.save();
    const trx = yield transaction_model_1.Transaction.create({
        from: userId,
        amount,
        type: 'withdraw',
        status: 'completed',
    });
    res.status(201).json({ message: 'Withdraw successful', trx });
}));
// wallet theke money send kora
exports.sendMoney = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { email, amount } = req.body;
    if (!email)
        throw new Error("Receiver email required");
    if (amount <= 0)
        throw new Error('Amount must be positive.');
    const senderWallet = yield wallet_model_1.default.findOne({ user: senderId });
    const receiverUser = yield user_model_1.User.findOne({ email: email });
    if (!receiverUser)
        throw new Error("Receiver not found");
    const receiverWallet = yield wallet_model_1.default.findOne({ user: receiverUser._id });
    if (!senderWallet || senderWallet.isBlocked)
        throw new Error('Sender wallet not found or blocked.');
    if (!receiverWallet || receiverWallet.isBlocked)
        throw new Error('Receiver wallet not found or blocked.');
    if (senderWallet.balance < amount)
        throw new Error('Insufficient balance.');
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    yield senderWallet.save();
    yield receiverWallet.save();
    const trx = yield transaction_model_1.Transaction.create({
        from: senderId,
        to: receiverUser._id,
        amount,
        type: 'transfer',
        status: 'completed',
    });
    res.status(201).json({ message: 'Money sent successfully', trx });
}));
// transation history dekha
exports.getMyTransactions = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const transactions = yield transaction_model_1.Transaction.find({
        $or: [{ from: userId }, { to: userId }],
    }).sort({ createdAt: -1 });
    res.status(200).json({ transactions });
}));
// admin er jnno show show kora
exports.getAllTransactions = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        res.status(403).json({ message: 'Access denied: Admins only' });
        return;
    }
    const transactions = yield transaction_model_1.Transaction.find()
        .populate('from', 'email role')
        .populate('to', 'email role');
    res.status(200).json(transactions);
}));
