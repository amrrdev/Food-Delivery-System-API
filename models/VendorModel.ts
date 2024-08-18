import mongoose, { Model, Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface VendorDocument extends Document {
  name: string;
  ownerName: string;
  foodType: string[];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  serviceAvailable: boolean;
  rating: number;
  coverImage: string[];
  // foods: any;
  comparePasswords(candidatePassword: string, encryptedPassword: string): Promise<boolean>;
}

const VendorSchema = new mongoose.Schema<VendorDocument>(
  {
    name: {
      type: String,
      required: [true, "A vendor must have a name"],
      trim: true,
      minLength: [3, "A vendor name must have more than 3 characters"],
      maxLength: [25, "A vendor name must have less than 25 characters"],
    },
    ownerName: {
      type: String,
      required: [true, "A vendor owner must have a name"],
      minLength: [3, "owner name must have more than 3 characters"],
      maxLength: [25, " owner name must have less than 25 characters"],
    },
    email: {
      type: String,
      required: [true, "A vendor must have an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "A vendor account must have a password"],
      select: false,
    },
    foodType: { type: [String], required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    serviceAvailable: { type: Boolean },
    rating: { type: Number },
    coverImage: { type: [String] },
    // foods: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "food",
    //   },
    // ],
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
      transform(document, resultJSObject) {
        delete resultJSObject.password;
        delete resultJSObject.createdAt;
        delete resultJSObject.updatedAt;
        delete resultJSObject.__v;
      },
    },
  }
);

VendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

VendorSchema.methods.comparePasswords = async function (candidatePassword: string, encryptedPassword: string) {
  return await bcrypt.compare(candidatePassword, encryptedPassword);
};

export const Vendor = mongoose.model<VendorDocument>("Vendor", VendorSchema);
