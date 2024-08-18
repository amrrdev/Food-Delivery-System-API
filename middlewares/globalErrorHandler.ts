import AppError from "../utility/AppError";

import express, { Request, Response, NextFunction } from "express";

export default (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode ||= 500;
  err.statusMessage ||= "error";
  res.status(err.statusCode).json({
    status: err.statusMessage,
    message: err.message,
    stack: err.stack,
  });
};
