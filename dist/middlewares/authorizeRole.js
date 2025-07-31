"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user info" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
