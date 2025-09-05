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
exports.getUserById = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
// auth.service.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
const user_model_1 = require("../user/user.model");
const token_1 = require("../../utils/token");
// -------- Register User --------
const registerUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, password, role = "user", }) {
    try {
        // only 1 admin allowed
        if (role === "admin") {
            const existingAdmin = yield user_model_1.User.findOne({ role: "admin" });
            if (existingAdmin)
                throw new Error("Only one admin allowed.");
        }
        // check if email exists
        const existingUser = yield user_model_1.User.findOne({ email });
        if (existingUser)
            throw new Error("Email already registered");
        // hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // create user
        const user = yield user_model_1.User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        // initial wallet with 50 balance
        const wallet = yield wallet_model_1.default.create({ user: user._id, balance: 50 });
        if (!wallet)
            throw new Error("Failed to create initial wallet");
        // issue tokens
        const payload = { userId: user._id.toString(), role: user.role };
        const accessToken = (0, token_1.generateAccessToken)(payload);
        const refreshToken = (0, token_1.generateRefreshToken)(payload);
        // save refresh token
        user.refreshTokens.push(refreshToken);
        yield user.save();
        return { user, accessToken, refreshToken };
    }
    catch (err) {
        console.error("registerUser service error:", err);
        throw err; // rethrow to controller
    }
});
exports.registerUser = registerUser;
// -------- Login User --------
const loginUser = (input, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = input;
    const user = yield user_model_1.User.findOne({ email });
    if (!user)
        throw new Error("User not found");
    // compare password
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    // issue tokens
    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = (0, token_1.generateAccessToken)(payload);
    const refreshToken = (0, token_1.generateRefreshToken)(payload);
    user.refreshTokens.push(refreshToken);
    yield user.save();
    // ✅ set cookies
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax", // localhost এ কাজ করবে
        secure: false, // dev এর জন্য
        maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
            refreshToken
        },
    };
});
exports.loginUser = loginUser;
// -------- Logout User --------
const logoutUser = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken)
        throw new Error("No refresh token found");
    const user = yield user_model_1.User.findOne({ refreshTokens: refreshToken });
    if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        yield user.save();
    }
    return { message: "Logged out successfully" };
});
exports.logoutUser = logoutUser;
// -------- Get User By ID --------
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.User.findById(id).select("-password");
});
exports.getUserById = getUserById;
