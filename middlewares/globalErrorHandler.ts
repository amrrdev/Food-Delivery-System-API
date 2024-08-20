import { Mongo11000Error } from "../dto";
import AppError from "../utility/AppError";
import express, { Request, Response, NextFunction } from "express";

type DatabaseError = Mongo11000Error;

export default (err: AppError | DatabaseError, req: Request, res: Response, next: NextFunction) => {
  if ("code" in err && err.code === 11000) {
    return res.status(400).json({
      status: "fail",
      message: `this ${Object.keys(err.keyValue)} is alreay exist: ${Object.values(err.keyValue)}`,
    });
  }

  // Handle generic AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode || 500).json({
      status: err.statusMessage || "error",
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  // Default fallback for unhandled errors
  res.status(500).json({
    status: "error",
    message: "An unexpected error occurred",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
