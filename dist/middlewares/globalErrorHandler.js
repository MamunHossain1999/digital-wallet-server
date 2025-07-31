"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong!";
    // Optional: for validation errors, mongoose cast errors, etc.
    const stack = process.env.NODE_ENV === "production" ? undefined : err.stack;
    res.status(statusCode).json({
        success: false,
        message,
        errorDetails: {
            name: err.name,
            message: err.message,
            stack,
        },
    });
};
exports.globalErrorHandler = globalErrorHandler;
