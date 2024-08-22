import path from "node:path";

import {
  adminRouter,
  vendorRouter,
  shoppingRouter,
  customerAuthRoute,
  customerRoute,
} from "./routes";
import { handleGlobalErrors, handleNotFound } from "./middlewares";

import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

app.use("/images", express.static(path.join(__dirname, "./images")));
app.use("/admin", adminRouter);

app.use("/vendor", vendorRouter);
app.use("/shopping", shoppingRouter);
app.use("/auth", customerAuthRoute);
app.use("/customer", customerRoute);

app.use(handleNotFound);
app.use(handleGlobalErrors);

export default app;
