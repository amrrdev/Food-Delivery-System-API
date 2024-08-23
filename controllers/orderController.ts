import { Request, Response, NextFunction } from "express";
import AppError from "../utility/AppError";
import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../utility/asyncWrapper";
import { Customer, Food, FoodDocument } from "../models";
import { OrderInputs } from "../dto";
import { Order } from "../models/OrderModel";
import mongoose from "mongoose";

export const createOrder = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;
  if (!customer) {
    return next(new AppError("There's no customer exist, please login", StatusCodes.NOT_FOUND));
  }

  const orderId = `${Math.floor(Math.random() * 8999) + 1000}`;

  const profile = await Customer.findById(customer.id);

  if (!profile) return;

  const cart = req.body as OrderInputs[];

  const cartItems: Array<{ food: FoodDocument; quantity: number }> = [];
  let netAmount = 0.0;

  const foods = await Food.find()
    .where("_id")
    .in(cart.map((item) => item.id))
    .exec();

  if (!foods || foods.length === 0) {
    return next(new AppError("There's no foods selected", StatusCodes.BAD_REQUEST));
  }

  foods.forEach((food) => {
    const cartItem = cart.find((item) => item.id === String(food._id));

    if (cartItem) {
      netAmount += cartItem.quantity * food.price;
      cartItems.push({ food: food, quantity: cartItem.quantity });
    }
  });

  const order = await Order.create({
    orderID: orderId,
    orderDate: new Date(),
    items: cartItems,
    totalAmount: netAmount,
    paidThrought: "COD",
    paymentResponse: "",
    orderStatus: "Waiting",
  });

  if (!order) {
    return next(new AppError("Error While creting an order", StatusCodes.INTERNAL_SERVER_ERROR));
  }

  profile.orders.push(order._id as mongoose.Schema.Types.ObjectId);
  await profile.save();
  res.status(StatusCodes.OK).json({
    status: "success",
    order,
  });
});

export const getAllOrders = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getOrderById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {}
);
