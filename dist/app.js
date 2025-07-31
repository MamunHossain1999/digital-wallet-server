"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_route_1 = require("./modules/auth/auth.route");
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
const wallet_routes_1 = require("./modules/wallet/wallet.routes");
const transaction_routes_1 = require("./modules/transaction/transaction.routes");
const admin_route_1 = require("./modules/auth/admin.route");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/auth", auth_route_1.AuthRoutes);
app.use('/api/admin', admin_route_1.adminRouter);
app.use('/api/transaction', transaction_routes_1.AuthTransation);
app.use('/api/wallet', wallet_routes_1.walletRoutes);
app.use(globalErrorHandler_1.globalErrorHandler);
