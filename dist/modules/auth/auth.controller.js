"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.logout = exports.login = exports.register = void 0;
const authService = __importStar(require("./auth.service"));
const auth_validation_1 = require("./auth.validation");
const zod_1 = require("zod");
// register
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        auth_validation_1.registerSchema.parse(req.body);
        const user = yield authService.registerUser(req.body);
        res.status(201).json({ message: 'User registered', user });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: err.issues.map(e => ({ field: e.path[0], message: e.message })),
            });
        }
        res.status(400).json({ message: 'Registration failed', error: err.message });
    }
});
exports.register = register;
// login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        auth_validation_1.loginSchema.parse(req.body);
        const data = yield authService.loginUser(req.body);
        res.status(200).json(data);
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: err.issues.map(e => ({ field: e.path[0], message: e.message })),
            });
        }
        res.status(401).json({ message: 'Login failed', error: err.message });
    }
});
exports.login = login;
// logout
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        yield authService.logoutUser(refreshToken);
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Logout failed', error: err.message });
    }
});
exports.logout = logout;
