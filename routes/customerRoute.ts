import express from "express";
import {
  addToCart,
  customerProfile,
  customerUpdateProfile,
  deleteCart,
  getCart,
} from "../controllers";
import { createOrder, getAllOrders, getOrderById } from "../controllers/orderController";
import { checkAuthentication } from "../middlewares";

const router = express.Router();

router.use(checkAuthentication);

router.route("/profile").get(customerProfile).patch(customerUpdateProfile);

router.route("/cart").get(getCart).post(addToCart).delete(deleteCart);

router.post("/create-order", createOrder);
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);

export { router as customerRoute };
