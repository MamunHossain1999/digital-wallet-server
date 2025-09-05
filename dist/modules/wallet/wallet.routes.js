"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wallet_controller_1 = require("./wallet.controller");
const verifyToken_1 = require("../../middlewares/verifyToken");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const router = express_1.default.Router();
// 🔐 Routes
router.get('/my', (0, verifyToken_1.verifyToken)(), wallet_controller_1.getWalletBalance); // user sees own wallet
router.get('/all', (0, verifyToken_1.verifyToken)(), (0, authorizeRole_1.authorizeRole)(['admin']), wallet_controller_1.getAllWallets); // admin sees all wallets
router.post('/add-money', (0, verifyToken_1.verifyToken)(), (0, authorizeRole_1.authorizeRole)(['user']), wallet_controller_1.addMoney); // user adds money
router.post('/withdraw', (0, verifyToken_1.verifyToken)(), (0, authorizeRole_1.authorizeRole)(['user']), wallet_controller_1.withdrawMoney); // user withdraws money
router.post('/send-money', (0, verifyToken_1.verifyToken)(), (0, authorizeRole_1.authorizeRole)(['user']), wallet_controller_1.sendMoney); // user sends money
router.patch('/block/:id', (0, verifyToken_1.verifyToken)(), (0, authorizeRole_1.authorizeRole)(['admin']), wallet_controller_1.blockWallet); // admin blocks wallet
exports.walletRoutes = router;
