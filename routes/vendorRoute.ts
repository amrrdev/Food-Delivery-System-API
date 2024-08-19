import path from "node:path";

import {
  addFood,
  deleteMyProfile,
  getFoods,
  getVendorProfile,
  updateVendorCoverImage,
  updateVendorProfile,
  updateVendorService,
  vendorLogin,
} from "../controllers";
import { checkAuthentication } from "../middlewares";

import express, { Request, Response, NextFunction } from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "./../images"));
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const uploadImages = multer({ storage }).array("images", 10);

router.route("/login").post(vendorLogin);

router.use(checkAuthentication);

router.route("/profile").get(getVendorProfile).patch(updateVendorProfile).delete(deleteMyProfile);
router.route("/coverImage").patch(uploadImages, updateVendorCoverImage);
router.route("/service").patch(updateVendorService);
router.route("/foods").get(getFoods).post(uploadImages, addFood);

export { router as vendorRouter };
