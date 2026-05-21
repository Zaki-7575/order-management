import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;

  // Prisma unique constraint error
  if (err.code === "P2002") {
    const target = err.meta?.target ? err.meta.target.join(", ") : "field";
    error = new AppError(`Duplicate field value: ${target}. Please use another value!`, 400);
  }

  // Prisma record not found
  if (err.code === "P2025") {
    error = new AppError("Record not found", 404);
  }

  if (error.isOperational) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error("ERROR 💥", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
