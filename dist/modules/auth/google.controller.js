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
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = void 0;
const google_service_1 = require("./google.service");
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        // Token validation
        if (!token || typeof token !== "string") {
            return res.status(400).json({ message: "Valid token is required" });
        }
        // Google login service
        const result = yield (0, google_service_1.handleGoogleLogin)(token);
        // Set refresh token cookie
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Optionally, set access token cookie
        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        // Send response
        res.status(200).json(result);
    }
    catch (err) {
        console.error("Google login error:", err);
        res
            .status(401)
            .json({ message: "Google login failed", error: err.message });
    }
});
exports.googleLogin = googleLogin;
