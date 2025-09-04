import express from "express";

import { getAgentProfile, getMe, login, logout,  register } from "./auth.controller";

import { googleLogin } from "./google.controller";
import { authenticate } from "../../middlewares/authenticate";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/google-login", googleLogin);
router.post("/logout", logout);
router.get("/agent-profile", authenticate, getAgentProfile);


export const authRoute = router;
