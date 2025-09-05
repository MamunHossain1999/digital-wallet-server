"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (roles = []) => {
    return (req, res, next) => {
        var _a;
        try {
            const authHeader = req.headers.authorization;
            const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || (authHeader ? authHeader.split(" ")[1] : null);
            if (!token) {
                return res.status(401).json({ message: "No token provided" });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded;
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "You don't have permission to access this resource" });
            }
            next();
        }
        catch (_b) {
            res.status(401).json({ message: "Invalid or expired token" });
        }
    };
};
exports.verifyToken = verifyToken;
