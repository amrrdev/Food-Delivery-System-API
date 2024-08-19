import {
  getFoodAvailability,
  getFoodIn30Minutes,
  getRestourantsById,
  getTopRestaurants,
  searchFood,
} from "../controllers";

import express from "express";

const router = express.Router();

// food availability
router.get("/:pincode", getFoodAvailability);

// Top rated Restaurant
router.get("/top-restaurant/:pincode", getTopRestaurants);

// Food available in 30 minutes
router.get("/food-in-30-min/:pincode", getFoodIn30Minutes);

// Search Food
router.get("/search/:pincode", searchFood);

// Find Restaurant By Id
router.get("/restourant/:id", getRestourantsById);

export { router as shoppingRouter };
