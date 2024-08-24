import { Request, Response, NextFunction } from "express";
import { UpdateVendorInput, VendorLoginInput } from "../dto";
import AppError from "../utility/AppError";
import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../utility/asyncWrapper";
import { Food, Vendor } from "../models";
import { attachCookiesToResponse } from "../utility";
import { CreateFoodInput } from "../dto/Food.dto";
import mongoose from "mongoose";
import { Order } from "../models/OrderModel";
import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse } from "cloudinary";

import fs from "node:fs";

const deleteUploadedImages = (req: Request) => {
  const files = req.files as Express.Multer.File[];
  files.forEach((file) => fs.unlinkSync(file.path));
};

const uploadImagesToClouninary = async (req: Request, next: NextFunction) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return next(new AppError("No images were uploaded", StatusCodes.BAD_REQUEST));
  }
  const imageUploadPromises = files.map(async (file: Express.Multer.File) => {
    return await cloudinary.uploader.upload(file.path, {
      use_filename: true,
      folder: "food-deliver-system",
    });
  });

  return await Promise.all(imageUploadPromises);
};

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

    if (!vendor) {
      return next(new AppError("Vendor not logged in", StatusCodes.UNAUTHORIZED));
    }

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

  const uploadResults = (await uploadImagesToClouninary(req, next)) as UploadApiResponse[];
  const images = uploadResults.map((result) => result.secure_url);

  deleteUploadedImages(req);

  const food = await Food.create({
    name,
    price,
    category,
    description,
    foodTypes,
    readyTime,
    images,
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

export const updateVendorCoverImage = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendor = await checkForExistingVendor(req, next);
    if (!vendor) return;

    const uploadResults = (await uploadImagesToClouninary(req, next)) as UploadApiResponse[];

    const images = uploadResults.map((result) => result.secure_url);

    vendor.coverImages.push(...images);
    await vendor.save();

    res.status(StatusCodes.OK).json({
      status: "success",
      data: { vendor },
    });
  }
);

export const getCurrentOrders = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendor = req.user;
    if (!vendor) {
      return next(new AppError("There's no user exist", StatusCodes.NOT_FOUND));
    }
    const orders = await Order.find({ vendorID: vendor.id }).populate("items.food");

    if (!orders) {
      return next(new AppError("There's no orders for this vendor", StatusCodes.NOT_FOUND));
    }

    res.status(200).json({ orders });
  }
);

export const getOrderDetailsById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    const vendor = req.user;
    if (!vendor) {
      return next(new AppError("There's no vendor exist", StatusCodes.NOT_FOUND));
    }

    const order = await Order.findOne({ _id: orderId, vendorID: vendor.id }).populate("items.food");

    if (!order) {
      return next(new AppError("There's no order with for this vendor", StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      order,
    });
  }
);

export const processOrder = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderID = req.params.id;
    const { status, remarks, time } = req.body;

    const order = await Order.findById(orderID);
    console.log(order);
    if (!order) {
      return next(new AppError("There's no order wth is ID", StatusCodes.NOT_FOUND));
    }
    order.orderStatus = status;
    if (time) {
      order.readyTime = time;
    }
    const orderResult = await order.save();
    res.status(StatusCodes.OK).json({
      status: "success",
      order: orderResult,
    });
  }
);
