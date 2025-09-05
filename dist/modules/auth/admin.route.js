"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../../middlewares/verifyToken");
const admin_controller_1 = require("./admin.controller");
const authenticate_1 = require("../../middlewares/authenticate");
const isAdmin_1 = require("../../middlewares/isAdmin");
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.get('/dashboard', (0, verifyToken_1.verifyToken)(['admin']), admin_controller_1.getAdminDashboard);
router.get("/all", authenticate_1.authenticate, isAdmin_1.isAdmin, user_controller_1.getAllUsers);
// admin.routes.ts
router.get("/me", (0, verifyToken_1.verifyToken)(["admin"]), admin_controller_1.getAdminProfile);
exports.adminRouter = router;
