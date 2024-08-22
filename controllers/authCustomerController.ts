import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import asyncWrapper from "../utility/asyncWrapper";
import { CreateUserInput, CustomerLoginInput, CustomerPayload } from "../dto";
import { validate } from "class-validator";
import AppError from "../utility/AppError";
import { StatusCodes } from "http-status-codes";
import { Customer } from "../models";

import {
  attachCookiesToResponse,
  generateOTP,
  handleValidationErrors,
  hashOTP,
  sendOTPEmail,
} from "../utility";

export const customerSignup = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerInput = plainToClass(CreateUserInput, req.body);
    const errors = await validate(customerInput);

    handleValidationErrors(errors, next);

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
    const customer = await Customer.findById(req.params.id).select("+otp +otpExpiry");

    const otp = req.body.otp as string;

    if (!customer) {
      return next(new AppError("Customer not found, Please login again", StatusCodes.NOT_FOUND));
    }

    const { hashedOTP, otpExpiry } = hashOTP(otp);

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
  async (req: Request, res: Response, next: NextFunction) => {
    const customerInput = plainToClass(CustomerLoginInput, req.body);
    const errors = await validate(customerInput);

    handleValidationErrors(errors, next);

    const customer = await Customer.findOne({ email: customerInput.email }).select("+password");

    if (
      !customer ||
      !(await customer.comparePasswords(customerInput.password, customer.password))
    ) {
      return next(new AppError("Incorrect email or password", StatusCodes.NOT_FOUND));
    }

    if (!customer.verified) {
      return next(
        new AppError(
          `Your account is not verified, please send a get request to /auth/verify/${customer._id}`,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    attachCookiesToResponse(res, {
      id: customer._id as string,
      email: customer.email,
      verified: customer.verified,
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      data: { customer },
    });
  }
);

export const customerLogout = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ message: "Customer logged out" });
  }
);

// get /delete-me -> otp
export const sendDeleteProfileOTP = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if (!customer)
      return next(new AppError("Customer not found, Please login again", StatusCodes.NOT_FOUND));

    const profile = await Customer.findById(customer.id).select("+otp +otpExpiry");

    if (!profile) {
      return next(new AppError("There's no customer exist, please login", StatusCodes.NOT_FOUND));
    }
    const otp = generateOTP();

    const { hashedOTP, otpExpiry } = hashOTP(otp);

    await sendOTPEmail(profile.email, otp);

    profile.otp = hashedOTP;
    profile.otpExpiry = otpExpiry;

    await profile.save();

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "OTP sent to your email. Please verify",
    });
  }
);

// delete /delete-me with otp
export const customerDeleteProfile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;
    const otp = req.body.otp;
    if (!customer)
      return next(new AppError("Customer not found, Please login again", StatusCodes.NOT_FOUND));

    const profile = await Customer.findById(customer.id).select("+otp + otpExpiry");

    if (!profile) {
      return next(new AppError("There's no customer exist, please login", StatusCodes.NOT_FOUND));
    }

    const { hashedOTP, otpExpiry } = hashOTP(otp);

    if (hashedOTP !== profile.otp || Date.now() >= profile.otpExpiry) {
      return next(new AppError("Invalid or expired OTP", StatusCodes.BAD_REQUEST));
    }

    await profile.deleteOne();

    res.cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "deleted successfully",
    });
  }
);
