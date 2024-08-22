import express from "express";
import {
  customerDeleteProfile,
  customerLogin,
  customerLogout,
  customerSignup,
  customerVerify,
  sendDeleteProfileOTP,
} from "../controllers";
import { checkAuthentication } from "../middlewares";

const router = express.Router();

router.post("/signup", customerSignup);
router.post("/login", customerLogin);
router.patch("/verify/:id", customerVerify);

router.use(checkAuthentication);

router.get("/logout", customerLogout);
router.route("/delete-me").get(sendDeleteProfileOTP).delete(customerDeleteProfile);

export { router as customerAuthRoute };
