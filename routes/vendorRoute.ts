import {
  addFood,
  deleteMyProfile,
  getFoods,
  getVendorProfile,
  updateVendorProfile,
  updateVendorService,
  vendorLogin,
} from "../controllers";

import express, { Request, Response, NextFunction } from "express";
import { checkAuthentication } from "../middlewares";

const router = express.Router();

router.route("/login").post(vendorLogin);

router.use(checkAuthentication);

router.route("/profile").get(getVendorProfile).patch(updateVendorProfile).delete(deleteMyProfile);

router.route("/service").patch(updateVendorService);

router.route("/foods").get(getFoods).post(addFood);

export { router as vendorRouter };
