import mongoose, { Document } from "mongoose";

export interface OfferDocument extends Document {
  offerType: string; //Vendor // Generic
  vendors: any[];
  title: string;
  description: string;
  discountPercentage: number; //min order amount should 300 EG
  expirationDate: Date;
  pincode: string; // OFFER WITHIN SPECIFIC AREA
  isActive: boolean;
}

const OfferSchema = new mongoose.Schema<OfferDocument>(
  {
    offerType: { type: String, required: true },
    vendors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
      },
    ],
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountPercentage: {
      type: Number,
      required: [true, "Discount percentage is required"],
      min: [0, "Discount percentage cannot be less than 0"],
      max: [100, "Discount percentage cannot exceed 100"],
    },
    expirationDate: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
    pincode: { type: String, required: true },
    isActive: Boolean,
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

export const Offer = mongoose.model<OfferDocument>("Offer", OfferSchema);
