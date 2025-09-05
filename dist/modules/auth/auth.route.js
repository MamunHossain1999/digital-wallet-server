"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const google_controller_1 = require("./google.controller");
const authenticate_1 = require("../../middlewares/authenticate");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.get("/me", authenticate_1.authenticate, auth_controller_1.getMe);
router.post("/google-login", google_controller_1.googleLogin);
router.post("/logout", auth_controller_1.logout);
router.get("/agent-profile", authenticate_1.authenticate, auth_controller_1.getAgentProfile);
exports.authRoute = router;
