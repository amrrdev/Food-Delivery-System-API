import path from "node:path";

import {
  adminRouter,
  vendorRouter,
  shoppingRouter,
  customerAuthRoute,
  customerRoute,
} from "./routes";

import { handleGlobalErrors, handleNotFound } from "./middlewares";
import { v2 as cloudinary } from "cloudinary";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

app.use("/images", express.static(path.join(__dirname, "./images")));
app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/vendor", vendorRouter);
app.use("/api/v1/shopping", shoppingRouter);
app.use("/api/v1/auth", customerAuthRoute);
app.use("/api/v1/customer", customerRoute);

app.use(handleNotFound);
app.use(handleGlobalErrors);

export default app;
