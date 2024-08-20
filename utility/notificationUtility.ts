import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

import crypto from "crypto";

import nodemailer, { SentMessageInfo, SendMailOptions } from "nodemailer";

export const generateOTP = () => {
  return Math.floor(100000 ** Math.random() * 900000).toString();
};

export const hashOTP = (otp: string) => {
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
  const otpExpiry = Date.now() + 10 * 60 * 1000;
  return { hashedOTP, otpExpiry };
};

export const sendOTPEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMIAL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions: SendMailOptions = {
    from: process.env.GMIAL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 30 minutes.`,
  };
  await transporter.sendMail(mailOptions);
};
