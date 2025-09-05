"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets are not defined in .env");
}
const generateAccessToken = (payload) => {
    const options = {
        expiresIn: (process.env.ACCESS_TOKEN_EXPIRES || "1d"),
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    const options = {
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRES || "7d"),
    };
    return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, options);
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (_a) {
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
    }
    catch (_a) {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
