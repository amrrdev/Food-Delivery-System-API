import express from "express";
import { createVendor, deleteVendor, getAllVendors, getVendorById } from "../controllers";

const router = express.Router();

router.route("/vendors").post(createVendor).get(getAllVendors);
router.route("/vendors/:id").get(getVendorById).delete(deleteVendor);

export { router as adminRouter };
