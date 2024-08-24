import { Request, Response, NextFunction } from "express";
import AppError from "../utility/AppError";
import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../utility/asyncWrapper";
import { Customer, Food, FoodDocument, Transaction, Vendor } from "../models";
import { OrderInputs } from "../dto";
import { Order } from "../models/OrderModel";
import mongoose from "mongoose";
import { Offer } from "../models/OfferModel";

export const createOrder = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (!customer) {
    return next(new AppError("There's no customer exist, please login", StatusCodes.NOT_FOUND));
  }

  const cart = req.body.cart as OrderInputs[];
  const orderId = `${Math.floor(Math.random() * 8999) + 1000}`;

  const profile = await Customer.findById(customer.id);

  if (!profile) {
    return next(new AppError("Customer are not logged in", StatusCodes.UNAUTHORIZED));
  }

  const cartItems: Array<{ food: mongoose.Schema.Types.ObjectId; quantity: number }> = [];
  let netAmount = 0.0;
  let vendorID: any;

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
  });

  let discount = 0;
  let finalAmount = netAmount;

  if (req.body.offerId) {
    const offer = await Offer.findById(req.body.offerId);

    if (offer && offer.isActive && new Date() < offer.expirationDate) {
      discount = (netAmount * offer.discountPercentage) / 100;
      finalAmount = netAmount - discount;
    } else {
      return next(new AppError("Invalid or expired offer", StatusCodes.BAD_REQUEST));
    }
  }

  const order = await Order.create({
    orderID: orderId,
    vendorID,
    orderDate: new Date(),
    items: cartItems,
    totalAmount: finalAmount,
    orderStatus: "Waiting",
    deliveryID: "",
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

    const order = await Order.findById(orderID).populate("items.food");

    if (!order) {
      return next(new AppError("There's no order with this ID", StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      order,
    });
  }
);
