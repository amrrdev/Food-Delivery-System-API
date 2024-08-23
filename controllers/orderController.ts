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

  const cartItems: Array<{ food: mongoose.Schema.Types.ObjectId; quantity: number }> = [];
  let netAmount = 0.0;
  let vendorID;
  console.log("a");
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
      vendorID = food.vendor;
      netAmount += cartItem.quantity * food.price;
      cartItems.push({
        food: food._id as mongoose.Schema.Types.ObjectId,
        quantity: cartItem.quantity,
      });
    }
    console.log(food);
  });

  const order = await Order.create({
    orderID: orderId,
    vendorID,
    orderDate: new Date(),
    items: cartItems,
    totalAmount: netAmount,
    paidThrought: "COD",
    paymentResponse: "",
    orderStatus: "Waiting",
    remarks: "",
    deliveryID: "",
    appliedOffers: false,
    offerId: "",
    readyTime: 25,
  });

  if (!order) {
    return next(new AppError("Error While creting an order", StatusCodes.INTERNAL_SERVER_ERROR));
  }
  profile.cart = [];
  profile.orders.push(order._id as mongoose.Schema.Types.ObjectId);
  await profile.save();

  res.status(StatusCodes.OK).json({
    status: "success",
    order,
  });
});

export const getAllOrders = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if (!customer) {
      return next(new AppError("There's no customer exist", StatusCodes.NOT_FOUND));
    }
    const orders = await Customer.findById(customer.id).populate({
      path: "orders",
      model: Order,
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      length: orders?.orders.length,
      orders: orders?.orders,
    });
  }
);

export const getOrderById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderID = req.params.id;

    if (!orderID) {
      return next(new AppError("There's no ID specificed", StatusCodes.BAD_REQUEST));
    }

    // TODO: Fix populations
    const order = await Order.findById(orderID);

    if (!order) {
      return next(new AppError("There's no order with this ID", StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      order,
    });
  }
);
