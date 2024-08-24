import express from "express";
import {
  addToCart,
  customerProfile,
  customerUpdateProfile,
  deleteCart,
  getCart,
  verifyOffer,
} from "../controllers";
import { createOrder, getAllOrders, getOrderById } from "../controllers/orderController";
import { checkAuthentication } from "../middlewares";

const router = express.Router();

router.use(checkAuthentication);

router.route("/profile").get(customerProfile).patch(customerUpdateProfile);

router.route("/cart").get(getCart).post(addToCart).delete(deleteCart);

// Apply offers
router.get("/offer/verify/:id", verifyOffer);

router.post("/create-order", createOrder);
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);

export { router as customerRoute };
