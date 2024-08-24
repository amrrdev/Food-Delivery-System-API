import mongoose, { Document } from "mongoose";

export interface TransactionDocument extends Document {
  customerId: string;
  vendorId: string;
  orderId: string;
  orderValue: number; // total amount
  offerUsed: string;
  status: string;
  paymentMode: string; // cash-delivery / card
  paymentResponse: string;
}

const TransactionSchema = new mongoose.Schema<TransactionDocument>(
  {
    customerId: { type: String },
    vendorId: { type: String },
    orderId: { type: String },
    orderValue: { type: Number }, // total amount
    offerUsed: { type: String },
    status: { type: String },
    paymentMode: { type: String }, // cash-delivery / card
    paymentResponse: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
      transform(doc, returnJSObject) {
        delete returnJSObject.__v;
      },
    },
  }
);

export const Transaction = mongoose.model<TransactionDocument>("Transaction", TransactionSchema);
