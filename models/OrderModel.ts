import mongoose, { Document } from "mongoose";
import { OrderInputs } from "../dto";

export interface OrderDocument extends Document {
  orderID: string; // 973287 for customer screen
  vendorID: string;
  items: any[];
  totalAmount: number;
  orderDate: Date;
  paidThrought: string;
  paymentResponse: string;
  orderStatus: string;
  remarks: string; // for cancled order
  deliveryID: string;
  appliedOffers: boolean;
  offerId: string;
  readyTime: number; // max 60 minutes
}

const OrderSchema = new mongoose.Schema<OrderDocument>(
  {
    orderID: { type: String, required: true, unique: true },
    vendorID: { type: String, required: true },
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
    remarks: { type: String },
    deliveryID: { type: String },
    offerId: { type: String },
    readyTime: { type: Number },
    appliedOffers: { type: Boolean },
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
