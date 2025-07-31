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
// money add korar jnno
const addMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
});
exports.addMoney = addMoney;
// money withdraw korar jnno
const withdrawMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
});
exports.withdrawMoney = withdrawMoney;
// onnno user er kase money send korar jnno
const sendMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { receiverId, amount } = req.body;
    if (!amount || amount <= 0)
        return res.status(400).json({ message: 'Invalid amount' });
    if (!receiverId)
        return res.status(400).json({ message: 'Receiver ID is required' });
    if (receiverId === senderId)
        return res.status(400).json({ message: 'Cannot send money to self' });
    const senderWallet = yield wallet_model_1.default.findOne({ user: senderId });
    const receiverWallet = yield wallet_model_1.default.findOne({ user: receiverId });
    if (!senderWallet || !receiverWallet)
        return res.status(404).json({ message: 'Wallet not found' });
    if (senderWallet.status === 'blocked' || receiverWallet.status === 'blocked')
        return res.status(403).json({ message: 'Wallet is blocked' });
    if (senderWallet.balance < amount)
        return res.status(400).json({ message: 'Insufficient balance' });
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    yield senderWallet.save();
    yield receiverWallet.save();
    yield transaction_model_1.Transaction.create({ type: 'transfer', from: senderId, to: receiverId, amount, status: 'completed' });
    res.json({ message: 'Money sent successfully', senderBalance: senderWallet.balance });
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
        yield wallet.save();
        res.status(200).json({
            message: `Wallet ${block ? "blocked" : "unblocked"} successfully`,
            wallet,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.blockWallet = blockWallet;
