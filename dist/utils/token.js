"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'secretkey';
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refreshsecretkey';
const generateAccessToken = (payload) => {
    const options = { expiresIn: '1d' };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    const options = { expiresIn: '7d' };
    return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, options);
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
