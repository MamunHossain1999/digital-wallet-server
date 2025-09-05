"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getAgentProfile = exports.getMe = exports.logout = exports.login = exports.register = void 0;
const authService = __importStar(require("./auth.service"));
const zod_1 = require("zod");
const auth_validation_1 = require("./auth.validation");
const user_model_1 = require("../user/user.model");
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
const transaction_model_1 = require("../transaction/transaction.model");
// -------- Register --------
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        auth_validation_1.registerSchema.parse(req.body);
        const user = yield authService.registerUser(req.body);
        res.status(201).json({ message: 'User registered', user });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: err.issues.map(e => ({ field: e.path[0], message: e.message })),
            });
        }
        res.status(400).json({ message: 'Registration failed', error: err.message });
    }
});
exports.register = register;
// -------- Login --------
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        auth_validation_1.loginSchema.parse(req.body);
        const data = yield authService.loginUser(req.body, res);
        res.status(200).json({
            message: "Login successful",
            user: data.user,
        });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError)
            return res
                .status(400)
                .json({ message: "Validation failed", errors: err.issues });
        res
            .status(401)
            .json({ message: "Login failed", error: err.message });
    }
});
exports.login = login;
// -------- Logout --------
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.refreshToken;
        if (!token)
            return res.status(400).json({ message: "No token found" });
        yield authService.logoutUser(token); // শুধু DB কাজ করবে
        // ✅ cookies clear এখানে করবেন (controller এ)
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });
        return res.json({ message: "Logged out successfully" });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Logout failed", error: err.message });
    }
});
exports.logout = logout;
// -------- Me --------
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    const user = yield user_model_1.User.findById(userId).select("-password");
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});
exports.getMe = getMe;
// agnet profile controller
const getAgentProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    const user = yield user_model_1.User.findById(userId).select("-password");
    if (!user || user.role !== "agent") {
        return res.status(404).json({ message: "Agent not found" });
    }
    // Wallet balance
    const wallet = yield wallet_model_1.default.findOne({ user: userId });
    const walletBalance = (wallet === null || wallet === void 0 ? void 0 : wallet.balance) || 0;
    // Total customers (user collection থেকে count)
    const totalCustomers = yield user_model_1.User.countDocuments({ agentId: userId });
    // Transactions count
    const transactions = yield transaction_model_1.Transaction.countDocuments({ agent: userId });
    res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status || "active",
        walletBalance,
        totalCustomers,
        transactions,
    });
});
exports.getAgentProfile = getAgentProfile;
