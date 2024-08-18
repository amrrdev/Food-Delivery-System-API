import { Request, Response, NextFunction } from "express";
import { UpdateVendorInput, VendorLoginInput } from "../dto";
import AppError from "../utility/AppError";
import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../utility/asyncWrapper";
import { Food, Vendor } from "../models";
import { attachCookiesToResponse, generateJWTToken } from "../utility";
import { CreateFoodInput } from "../dto/Food.dto";
import mongoose from "mongoose";

const checkForExistingVendor = async (req: Request, next: NextFunction, populateField?: string) => {
  const user = req.user;

  if (!user) {
    return next(new AppError("Vendor not found, Please login", StatusCodes.NOT_FOUND));
  }
  let query = Vendor.findById(user.id);

  if (populateField) {
    query = query.populate({ path: populateField, model: Food });
  }
  const vendor = await query.exec();

  if (!vendor) {
    return next(new AppError("Vendor not found, Please login", StatusCodes.NOT_FOUND));
  }

  return vendor;
};

export const vendorLogin = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = <VendorLoginInput>req.body;

  if (!email || !password) {
    return next(new AppError("Please provide both email and password", StatusCodes.BAD_REQUEST));
  }

  const vendor = await Vendor.findOne({ email: email }).select("+password");

  if (!vendor || !(await vendor.comparePasswords(password, vendor.password))) {
    return next(new AppError("Invalid Email or Password", StatusCodes.BAD_REQUEST));
  }

  attachCookiesToResponse(res, {
    id: vendor._id as string,
    email: vendor.email,
    name: vendor.name,
  });

  res.status(StatusCodes.OK).json({
    status: "success",
    date: { vendor },
  });
});

export const getVendorProfile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendor = await checkForExistingVendor(req, next);
    if (!vendor) return;

    res.status(StatusCodes.OK).json({
      status: "success",
      data: { vendor },
    });
  }
);

export const updateVendorProfile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendor = await checkForExistingVendor(req, next);

    const { name, phone, address, foodType } = req.body as UpdateVendorInput;

    if (!vendor) return;

    vendor.name = name;
    vendor.phone = phone;
    vendor.address = address;
    vendor.foodType = foodType;

    const updatedVendor = await vendor.save();

    res.status(StatusCodes.OK).json({
      status: "success",
      data: { vendor: updatedVendor },
    });
  }
);

export const deleteMyProfile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendor = await checkForExistingVendor(req, next);

    if (!vendor) return;

    const result = await vendor.deleteOne();

    if (!result.acknowledged) {
      return next(new AppError(`Vendor not found or already deleted`, StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Vendor deleted successfully",
    });
  }
);

export const updateVendorService = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendor = await checkForExistingVendor(req, next);

    if (!vendor) return;

    vendor.serviceAvailable = !vendor.serviceAvailable;

    const updatedVendor = await vendor.save();

    res.status(StatusCodes.OK).json({
      status: "success",
      data: { vendor: updatedVendor },
    });
  }
);

export const addFood = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const vendor = await checkForExistingVendor(req, next);
  if (!vendor) return;

  const { name, price, category, description, foodTypes, readyTime } = req.body as CreateFoodInput;

  const food = await Food.create({
    name,
    price,
    category,
    description,
    foodTypes,
    readyTime,
    images: ["hello.pg"],
    vendor: vendor._id,
  });

  vendor.foods.push(food._id as mongoose.Schema.Types.ObjectId);
  await vendor.save();

  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: { food },
  });
});

export const getFoods = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const vendor = await checkForExistingVendor(req, next);

  if (!vendor) return;

  const foods = await Food.find({ vendor: vendor._id });

  if (!foods) {
    return next(new AppError("There's no food with this ID", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    data: { foods },
  });
});
