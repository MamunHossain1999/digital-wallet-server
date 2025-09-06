"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wallet_controller_1 = require("./wallet.controller");
const transaction_controller_1 = require("../transaction/transaction.controller");
const verifyToken_1 = require("../../middlewares/verifyToken");
const router = express_1.default.Router();
// 🔐 Routes
router.get('/my', (0, verifyToken_1.verifyToken)(['user', 'agent', 'admin']), wallet_controller_1.getWalletBalance); // user sees own wallet
router.get('/all', (0, verifyToken_1.verifyToken)(['admin']), wallet_controller_1.getAllWallets); // admin sees all wallets
router.post('/add-money', (0, verifyToken_1.verifyToken)(['user', 'agent', 'admin']), transaction_controller_1.topUp); // user adds money
router.post('/withdraw', (0, verifyToken_1.verifyToken)(['user', 'agent', 'admin']), transaction_controller_1.withdraw); // user withdraws money
router.post('/send-money', (0, verifyToken_1.verifyToken)(['user', 'agent', 'admin']), transaction_controller_1.sendMoney); // user sends money
router.patch('/block/:id', (0, verifyToken_1.verifyToken)(['admin']), wallet_controller_1.blockWallet); // admin blocks wallet
exports.walletRoutes = router;
