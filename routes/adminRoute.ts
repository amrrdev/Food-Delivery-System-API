import express from "express";
import {
  createVendor,
  deleteVendor,
  getAlltransaction,
  getAllVendors,
  getTransactionById,
  getVendorById,
} from "../controllers";

const router = express.Router();

router.route("/vendors").post(createVendor).get(getAllVendors);
router.route("/vendors/:id").get(getVendorById).delete(deleteVendor);
router.route("/transactions").get(getAlltransaction);
router.route("/transaction/:id").get(getTransactionById);

export { router as adminRouter };
