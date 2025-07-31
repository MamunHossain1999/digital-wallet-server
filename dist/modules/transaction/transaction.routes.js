"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTransation = void 0;
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("./transaction.controller");
const verifyToken_1 = require("../../middlewares/verifyToken");
const router = express_1.default.Router();
router.post('/top-up', (0, verifyToken_1.verifyToken)(['user', 'agent', 'admin']), transaction_controller_1.topUp); //wallet a money add 
router.post('/withdraw', (0, verifyToken_1.verifyToken)(['user', 'agent', 'admin']), transaction_controller_1.withdraw); //wallet theke money uthano
router.post('/send', (0, verifyToken_1.verifyToken)(['user', 'agent', 'admin']), transaction_controller_1.sendMoney); // wallet theke money send kora
router.get('/history', (0, verifyToken_1.verifyToken)(['user', 'agent', 'admin']), transaction_controller_1.getMyTransactions); // money transation history show kora 
router.get('/admin', (0, verifyToken_1.verifyToken)(['admin']), transaction_controller_1.getAllTransactions); //admin sob kisu dekha ba manage kora
exports.AuthTransation = router;
