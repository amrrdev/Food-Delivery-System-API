import mongoose, { Model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface CustomerDocument extends Document {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  password: string;
  phone: string;
  verified: boolean;
  otp: string;
  otpExpiry: number;
  latitude: number;
  longitude: number;
  comparePasswords(candidatePassword: string, encryptedPassword: string): Promise<boolean>;
}

const CustomerSchema = new mongoose.Schema<CustomerDocument>(
  {
    firstName: { type: String, required: [true, "Please, tell us your first name"] },
    lastName: { type: String, required: [true, "Please, tell us your last name"] },
    address: { type: String, required: [true, "Please provide your address"] },
    phone: { type: String, required: [true, "Please provide your mobile phone"] },
    email: { type: String, unique: true, required: [true, "Please provide your email"] },
    password: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    verified: { type: Boolean, required: true },
    otp: { type: String, required: true }, // ---- This is for OTP verifications
    otpExpiry: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
      transform(document, resultJSObject) {
        delete resultJSObject.__v;
        delete resultJSObject.createdAt;
        delete resultJSObject.updatedAt;
        delete resultJSObject.password;
      },
    },
  }
);

CustomerSchema.index({ email: 1 }, { unique: true });

CustomerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
CustomerSchema.methods.comparePasswords = async function (
  candidatePassword: string,
  encryptedPassword: string
) {
  return await bcrypt.compare(candidatePassword, encryptedPassword);
};

export const Customer = mongoose.model<CustomerDocument>("customer", CustomerSchema);
