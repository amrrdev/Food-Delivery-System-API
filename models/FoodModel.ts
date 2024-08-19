import mongoose, { Model, Document, Schema } from "mongoose";
import { EnumType } from "typescript";

export interface FoodDocument extends Document {
  vendor: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  foodTypes: string;
  readyTime: number;
  ratings: number;
  images: string[];
}

const FoodSchema = new mongoose.Schema<FoodDocument>(
  {
    name: {
      type: String,
      minlength: [5, "A food name must have more than 5 character"],
      maxlength: [50, "A food name must have less than 50 character"],
      required: [true, "A food must have a name"],
    },
    description: {
      type: String,
      minlength: [10, "A description must have more than 10 character"],
      required: [true, "A food must have a description"],
    },
    price: {
      type: Number,
      required: [true, "A food must have a price"],
    },
    category: {
      type: String,
      required: [true, "A food must belongs to category"],
    },
    foodTypes: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    readyTime: Number,
    images: [String],
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: "Vendor",
      required: [true, "A food must belong to a vendor"],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
      transform(document, resultJSObject) {
        delete resultJSObject.__v;
        delete resultJSObject.createdAt;
        delete resultJSObject.updatedAt;
      },
    },
  }
);

export const Food = mongoose.model<FoodDocument>("Food", FoodSchema);
