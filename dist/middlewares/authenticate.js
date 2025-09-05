"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const token_1 = require("../utils/token");
const authenticate = (req, res, next) => {
    var _a;
    console.log("headers.cookie:", req.headers.cookie);
    console.log("req.cookies:", req.cookies);
    // 1) cookie প্রাধান্য
    let token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    // 2) fallback to Authorization header
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }
    if (!token)
        return res.status(401).json({ message: "No token provided" });
    const decoded = (0, token_1.verifyAccessToken)(token);
    if (!decoded)
        return res.status(401).json({ message: "Invalid token" });
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
};
exports.authenticate = authenticate;
