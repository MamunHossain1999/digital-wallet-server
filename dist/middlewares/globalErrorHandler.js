"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong";
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation failed";
    }
    res.status(statusCode).json({
        message,
        success: false,
        error: err,
    });
};
exports.globalErrorHandler = globalErrorHandler;
