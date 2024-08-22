import { Request, Response, NextFunction } from "express";

import asyncWrapper from "../utility/asyncWrapper";
import { Customer } from "../models";
import AppError from "../utility/AppError";
import { StatusCodes } from "http-status-codes";
import { plainToClass } from "class-transformer";
import { UpdateCustomerProfileInput } from "../dto";
import { validate } from "class-validator";
import { handleValidationErrors } from "../utility";

export const customerProfile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if (!customer) {
      return next(new AppError("There's no customer exist, please login", StatusCodes.NOT_FOUND));
    }

    const profile = await Customer.findById(customer.id);

    if (!profile) {
      return next(new AppError("There's no customer exist, please login", StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      data: { profile },
    });
  }
);

export const customerUpdateProfile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const profileInput = plainToClass(UpdateCustomerProfileInput, req.body);
    const errors = await validate(profileInput);

    handleValidationErrors(errors, next);

    const customer = req.user;

    if (!customer) {
      return next(new AppError("There's no customer exist, please login", StatusCodes.NOT_FOUND));
    }

    const updatedProfile = await Customer.findByIdAndUpdate(customer.id, profileInput, {
      runValidators: true,
      new: true,
    });

    if (!updatedProfile) {
      return next(
        new AppError("There's no customer exist, please login and try again", StatusCodes.NOT_FOUND)
      );
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      data: { profile: updatedProfile },
    });
  }
);
