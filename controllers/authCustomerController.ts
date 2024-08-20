import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import asyncWrapper from "../utility/asyncWrapper";
import { CreateUserInput, CustomerPayload } from "../dto";
import { validate } from "class-validator";
import AppError from "../utility/AppError";
import { StatusCodes } from "http-status-codes";
import { Customer } from "../models";

import bcrypt from "bcrypt";

import { attachCookiesToResponse, generateOTP, hashOTP, sendOTPEmail } from "../utility";

export const customerSignup = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerInput = plainToClass(CreateUserInput, req.body);
    const errors = await validate(customerInput);

    if (errors.length > 0) {
      const formattedErrors = errors
        .map((error) => {
          const propertyErrors = Object.values(error.constraints || {}).join(", ");
          return `${error.property}: ${propertyErrors}`;
        })
        .join("; ");

      return next(new AppError(`Error in user input: ${formattedErrors}`, StatusCodes.BAD_REQUEST));
    }

    const otp = generateOTP();

    await sendOTPEmail(customerInput.email, otp);
    const { hashedOTP, otpExpiry } = hashOTP(otp);

    const customer = await Customer.create({
      email: customerInput.email,
      password: customerInput.password,
      phone: customerInput.phone,
      firstName: customerInput.firstName,
      lastName: customerInput.lastName,
      address: customerInput.address,
      verified: false,
      otp: hashedOTP,
      otpExpiry,
      latitude: 0,
      longitude: 0,
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "OTP sent to your email. Please verify.",
      data: { id: customer._id },
    });
  }
);

export const customerVerify = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = await Customer.findById(req.params.id);

    const otp = req.body.otp as string;

    if (!customer) {
      return next(new AppError("Customer not found, Please login again", StatusCodes.NOT_FOUND));
    }
    console.log(customer);
    console.log("1");
    const { hashedOTP, otpExpiry } = hashOTP(otp);
    console.log("2");

    if (hashedOTP !== customer.otp || Date.now() >= customer.otpExpiry) {
      return next(new AppError("Invalid or expired OTP", StatusCodes.BAD_REQUEST));
    }

    customer.verified = true;

    attachCookiesToResponse(res, {
      id: customer._id as string,
      email: customer.email,
      verified: customer.verified,
    });

    const verifiedCustomer = await customer.save();

    res.status(StatusCodes.OK).json({
      status: "success",
      data: { customer: verifiedCustomer },
    });
  }
);

export const customerLogin = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {}
);
export const customerLogout = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {}
);
