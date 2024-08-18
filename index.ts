import express from "express";
import { adminRouter, vendorRouter } from "./routes";
import { handleGlobalErrors, handleNotFound } from "./middlewares";
const app = express();

app.use(express.json());

// /admin/vendros
// /admin/vendros/:id
app.use("/admin", adminRouter);

// /vendor/login
// /vendor/proile
// /vendor/resetPassword

app.use("/vendor", vendorRouter);

app.use(handleNotFound);
app.use(handleGlobalErrors);

export default app;
