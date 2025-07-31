"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../../middlewares/verifyToken");
const admin_controller_1 = require("./admin.controller");
const router = express_1.default.Router();
router.get('/dashboard', (0, verifyToken_1.verifyToken)(['admin']), admin_controller_1.getAdminDashboard);
exports.adminRouter = router;
