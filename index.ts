import path from "node:path";

import { adminRouter, vendorRouter, shoppingRouter } from "./routes";
import { handleGlobalErrors, handleNotFound } from "./middlewares";

import express from "express";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/images", express.static(path.join(__dirname, "./images")));
app.use("/admin", adminRouter);

app.use("/vendor", vendorRouter);
app.use("/shopping", shoppingRouter);

app.use(handleNotFound);
app.use(handleGlobalErrors);

export default app;
