import path from "node:path";

import {
  addFood,
  addOffer,
  deleteMyProfile,
  getAllOffers,
  getCurrentOrders,
  getFoods,
  getOrderDetailsById,
  getVendorProfile,
  processOrder,
  updateOffer,
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

// Orders Route
router.route("/orders").get(getCurrentOrders);
router.route("/order/:id").get(getOrderDetailsById);
router.route("/order/:id/process").patch(processOrder);

// Offers Route
router.route("/offers").get(getAllOffers).post(addOffer);
router.route("/offer/:id").put(updateOffer);

export { router as vendorRouter };
