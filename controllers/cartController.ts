import { Request, Response, NextFunction } from "express";

import asyncWrapper from "../utility/asyncWrapper";
import AppError from "../utility/AppError";
import { StatusCodes } from "http-status-codes";
import { Customer, CustomerDocument, Food } from "../models";
import { OrderInputs } from "../dto";
import mongoose from "mongoose";

const checkForCustomerAndReturnProfile = async (
  req: Request,
  next: NextFunction,
  populateCart: boolean = false
) => {
  const customer = req.user;
  if (!customer) {
    return next(new AppError("There's no customer exist", StatusCodes.NOT_FOUND));
  }

  let query = Customer.findById(customer.id).select("-cart._id");

  // Conditionally populate the cart if needed
  if (populateCart) {
    query = query.populate({
      path: "cart.food",
      model: "Food",
    });
  }

  const profile = await query;

  if (!profile) {
    return next(new AppError("There's no customer exist", StatusCodes.NOT_FOUND));
  }
  return profile;
};

const getProfileCart = (profile: CustomerDocument, next: NextFunction) => {
  const cart = profile.cart;

  if (!cart) {
    return next(new AppError("There's no cart", StatusCodes.NOT_FOUND));
  }
  return cart;
};

export const addToCart = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const profile = (await checkForCustomerAndReturnProfile(req, next)) as CustomerDocument;

  const { id, quantity } = req.body as OrderInputs;

  const food = await Food.findById(id);

  if (!food) {
    return next(new AppError("There's no food with this ID", StatusCodes.NOT_FOUND));
  }

  const existingItemIndex = profile.cart.findIndex(
    (item) => String(item.food) === String(food._id)
  );

  if (existingItemIndex >= 0) {
    profile.cart[existingItemIndex].quantity += quantity;
  } else {
    profile.cart.push({ food: food._id, quantity });
  }

  await profile.save();

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Item added to cart successfully",
    cart: profile.cart,
  });
});

export const getCart = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const profile = (await checkForCustomerAndReturnProfile(req, next, true)) as CustomerDocument;

  const cart = getProfileCart(profile, next);

  res.status(StatusCodes.OK).json({
    status: "success",
    cart,
  });
});

export const deleteCart = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const profile = (await checkForCustomerAndReturnProfile(req, next)) as CustomerDocument;

  profile.cart = [];
  await profile.save();

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "cart deleted successfully",
  });
});
