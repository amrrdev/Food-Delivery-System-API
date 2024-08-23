import mongoose, { Document } from "mongoose";
import { OrderInputs } from "../dto";

export interface OrderDocument extends Document {
  orderID: string;
  items: [any];
  totalAmount: number;
  orderDate: Date;
  paidThrought: string;
  paymentResponse: string;
  orderStatus: string;
}

const OrderSchema = new mongoose.Schema<OrderDocument>(
  {
    orderID: { type: String, required: true, unique: true },
    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    orderStatus: { type: String },
    paidThrought: { type: String },
    paymentResponse: { type: String },
  },
  {
    toJSON: {
      transform(document, returnJSObject) {
        delete returnJSObject.createdAt;
        delete returnJSObject.updatedAt;
        delete returnJSObject.__v;
      },
    },
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export const Order = mongoose.model<OrderDocument>("Order", OrderSchema);
