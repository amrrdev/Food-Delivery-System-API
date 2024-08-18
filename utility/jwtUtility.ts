import jwt from "jsonwebtoken";
import { VendorPayload } from "../dto";
import { Response } from "express";

export const generateJWTToken = (payload: VendorPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const verifyJWTToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        return reject(err.message);
      }
      resolve(decoded as VendorPayload);
    });
  });
};

export const attachCookiesToResponse = (res: Response, payload: VendorPayload) => {
  const token = generateJWTToken(payload);

  res.cookie("token", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  });
};
