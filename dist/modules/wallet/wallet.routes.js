"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wallet_controller_1 = require("./wallet.controller");
const verifyToken_1 = require("../../middlewares/verifyToken");
const router = express_1.default.Router();
// 🔐 Routes with role-based token verification
router.get('/me', (0, verifyToken_1.verifyToken)(), wallet_controller_1.getWalletBalance); //user nijer information dekhar jnno
router.get('/all', (0, verifyToken_1.verifyToken)(['admin']), wallet_controller_1.getAllWallets); //all wallet aksathe dekhar jnno
router.post('/add-money', (0, verifyToken_1.verifyToken)(['user']), wallet_controller_1.addMoney); //money add korar jnno
router.post('/withdraw', (0, verifyToken_1.verifyToken)(['user']), wallet_controller_1.withdrawMoney); //money othanor jnno
router.post('/send-money', (0, verifyToken_1.verifyToken)(['user']), wallet_controller_1.sendMoney); //money pathanor jnno
router.patch('/block/:id', (0, verifyToken_1.verifyToken)(['admin']), wallet_controller_1.blockWallet); //admin block korar jnno
exports.walletRoutes = router;
