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
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
const user_model_1 = require("../user/user.model");
const token_1 = require("../../utils/token");
const refreshTokens = [];
// register user
const registerUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, password, role = "user", }) {
    // akjoner besi admin hote parbe na
    if (role === "admin") {
        const existingAdmin = yield user_model_1.User.findOne({ role: "admin" });
        if (existingAdmin)
            throw new Error("Only one admin allowed.");
    }
    const existingUser = yield user_model_1.User.findOne({ email });
    if (existingUser)
        throw new Error("Email already registered");
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const user = yield user_model_1.User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });
    yield wallet_model_1.default.create({ user: user._id, balance: 50 });
    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = (0, token_1.generateAccessToken)(payload);
    const refreshToken = (0, token_1.generateRefreshToken)(payload);
    refreshTokens.push(refreshToken);
    return { user, accessToken, refreshToken };
});
exports.registerUser = registerUser;
// login user
const loginUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, }) {
    const user = yield user_model_1.User.findOne({ email });
    if (!user)
        throw new Error("User not found");
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = (0, token_1.generateAccessToken)(payload);
    const refreshToken = (0, token_1.generateRefreshToken)(payload);
    refreshTokens.push(refreshToken);
    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
});
exports.loginUser = loginUser;
// logout 
const logoutUser = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const index = refreshTokens.indexOf(refreshToken);
    if (index > -1) {
        refreshTokens.splice(index, 1);
    }
    else {
        throw new Error("Invalid refresh token");
    }
});
exports.logoutUser = logoutUser;
