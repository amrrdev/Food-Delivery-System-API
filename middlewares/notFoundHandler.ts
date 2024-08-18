import AppError from "../utility/AppError";

import { StatusCodes } from "http-status-codes";
import express, { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError(`Can't find ${req.url} on the server!`, StatusCodes.NOT_FOUND));
};
