import express from "express";
import { customerLogin, customerLogout, customerSignup, customerVerify } from "../controllers";

const router = express.Router();

router.post("/signup", customerSignup);
router.post("/login", customerLogin);
router.get("/logout", customerLogout);
router.patch("/verify/:id", customerVerify);

export { router as customerAuthRoute };
