import express from "express";
import { customerProfile, customerUpdateProfile } from "../controllers";
import { checkAuthentication } from "../middlewares";

const router = express.Router();

router.use(checkAuthentication);

router.route("/profile").get(customerProfile).patch(customerUpdateProfile);

export { router as customerRoute };
