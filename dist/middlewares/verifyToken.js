"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (roles = []) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                console.log('No Authorization header found');
                return res.status(401).json({ message: 'No token provided' });
            }
            console.log('Authorization header:', authHeader);
            const token = authHeader.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secretkey');
            console.log('Decoded token:', decoded);
            req.user = decoded;
            if (roles.length && !roles.includes(decoded.role)) {
                console.log('Access forbidden: insufficient role');
                return res.status(403).json({ message: 'Access forbidden: insufficient role' });
            }
            next();
        }
        catch (error) {
            console.log('JWT verify error:', error);
            res.status(401).json({ message: 'Invalid token', error });
        }
    };
};
exports.verifyToken = verifyToken;
