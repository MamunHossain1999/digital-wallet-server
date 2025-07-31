"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user', 'agent'], required: true },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    commissionRate: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', userSchema);
