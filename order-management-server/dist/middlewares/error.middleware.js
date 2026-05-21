"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    let error = { ...err };
    error.message = err.message;
    // Prisma unique constraint error
    if (err.code === "P2002") {
        const target = err.meta?.target ? err.meta.target.join(", ") : "field";
        error = new AppError_1.AppError(`Duplicate field value: ${target}. Please use another value!`, 400);
    }
    // Prisma record not found
    if (err.code === "P2025") {
        error = new AppError_1.AppError("Record not found", 404);
    }
    if (error.isOperational) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }
    else {
        // Programming or other unknown error: don't leak error details
        console.error("ERROR 💥", err);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=error.middleware.js.map