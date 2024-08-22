import { NextFunction, Request, Response } from "express";
import asyncWrapper from "../utility/asyncWrapper";
import AppError from "../utility/AppError";
import { StatusCodes } from "http-status-codes";
import { verifyJWTToken } from "./../utility";
import { Customer, Vendor } from "../models";
import { AuthPayload } from "../dto/Auth.dto";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const checkAuthentication = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token as string;
    if (!token) {
      return next(
        new AppError(
          "Your are not logged in! Please log in to get access",
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    const decoded = (await verifyJWTToken(token)) as AuthPayload;

    if ("verified" in decoded) {
      const customer = await Customer.findById(decoded.id);
      if (!customer) {
        return next(new AppError("Customer no longer exist", StatusCodes.NOT_FOUND));
      }
    } else {
      const vendor = await Vendor.findById(decoded.id);
      if (!vendor) {
        return next(new AppError("Vendor no longer exist", StatusCodes.NOT_FOUND));
      }
    }
    req.user = decoded;
    next();
  }
);
