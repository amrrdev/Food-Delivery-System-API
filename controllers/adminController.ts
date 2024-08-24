import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Transaction, Vendor } from "../models";
import AppError from "../utility/AppError";
import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../utility/asyncWrapper";

export const createVendor = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone, email, pincode, address, foodType, ownerName, password } = <
      CreateVendorInput
    >req.body;

    const isVendorAlreadyExist = await Vendor.findOne({ email });

    if (isVendorAlreadyExist) {
      return next(new AppError("this email already exist", StatusCodes.BAD_REQUEST));
    }

    const vendor = await Vendor.create({
      name,
      phone,
      email,
      pincode,
      address,
      foodType,
      ownerName,
      password,
      serviceAvailable: false,
      coverImage: [],
      foods: [],
    });

    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: { vendor },
    });
  }
);

export const getAllVendors = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await Vendor.find({});

    if (!vendors)
      return next(
        new AppError(
          "Error while featching Vendors, Please try again",
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );

    res.status(StatusCodes.OK).json({
      status: "success",
      length: vendors.length,
      data: { vendors },
    });
  }
);

export const getVendorById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id)
      return next(new AppError("There's no id provided!", StatusCodes.BAD_REQUEST));

    const vendor = await Vendor.findById(req.params.id);

    if (!vendor)
      return next(
        new AppError(`There's no vendor with this ID ${req.body.id}`, StatusCodes.NOT_FOUND)
      );

    res.status(StatusCodes.OK).json({
      status: "success",
      data: { vendor },
    });
  }
);

export const deleteVendor = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!deletedVendor)
      return next(new AppError("There's no Vendor with this ID", StatusCodes.BAD_REQUEST));

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Deleted Successfully",
    });
  }
);

export const getAlltransaction = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await Transaction.find();
    if (!transaction || transaction.length === 0) {
      return next(new AppError("There's no transaction", StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      transaction,
    });
  }
);

export const getTransactionById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return next(new AppError("There's no transaction", StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      transaction,
    });
  }
);
