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
exports.handleGoogleLogin = void 0;
const google_auth_library_1 = require("google-auth-library");
const user_model_1 = require("../user/user.model");
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
const token_1 = require("../../utils/token");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const handleGoogleLogin = (credential) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket = yield client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email)
            throw new Error("Invalid Google token");
        console.log("Google payload:", payload);
        let user = yield user_model_1.User.findOne({ email: payload.email });
        if (!user) {
            const hashedPassword = yield bcryptjs_1.default.hash("random-google-password", 10);
            user = yield user_model_1.User.create({
                name: payload.name || payload.email.split('@')[0],
                email: payload.email,
                password: hashedPassword,
                image: payload.picture,
                role: "user",
                refreshTokens: [],
            });
            // Create initial wallet for new Google user
            yield wallet_model_1.default.create({
                user: user._id,
                balance: 50
            });
            console.log("New Google user created:", user);
        }
        const tokenPayload = { userId: user._id.toString(), role: user.role };
        const accessToken = (0, token_1.generateAccessToken)(tokenPayload);
        const refreshToken = (0, token_1.generateRefreshToken)(tokenPayload);
        // Save refresh token in DB (avoid duplicates)
        if (!user.refreshTokens.includes(refreshToken)) {
            user.refreshTokens.push(refreshToken);
            yield user.save();
        }
        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
            },
            accessToken,
            refreshToken,
        };
    }
    catch (error) {
        console.error("Google login service error:", error);
        throw error;
    }
});
exports.handleGoogleLogin = handleGoogleLogin;
