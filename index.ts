import { adminRouter, vendorRouter } from "./routes";
import { handleGlobalErrors, handleNotFound } from "./middlewares";

import express from "express";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());

// /admin/vendros
// /admin/vendros/:id
app.use("/admin", adminRouter);

// /vendor/login
// /vendor/proile
// /vendor/resetPassword

// restaurant owner
app.use("/vendor", vendorRouter);

app.use(handleNotFound);
app.use(handleGlobalErrors);

export default app;
