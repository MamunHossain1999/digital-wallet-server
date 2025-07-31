"use strict";
// src/models/transaction.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['add', 'withdraw', 'transfer', 'cash-in', 'cash-out'],
        required: true,
    },
    from: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    to: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true,
    },
    fee: {
        type: Number,
        default: 0,
    },
    commission: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'reversed'],
        default: 'completed',
    },
}, {
    timestamps: true,
});
exports.Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
