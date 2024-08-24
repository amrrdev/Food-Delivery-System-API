import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../utility/asyncWrapper";
import { Food, FoodDocument, Vendor, VendorDocument } from "../models";
import AppError from "../utility/AppError";
import { StatusCodes } from "http-status-codes";
import { VendorQuery } from "./../dto";
import { Offer, OfferDocument } from "../models/OfferModel";

type PopulatedVendorDocument = VendorDocument & { foods: FoodDocument[] };
type EntityResponse = VendorDocument | VendorDocument[] | FoodDocument[];

const foodsResponse = (res: Response, foods: FoodDocument[]) => {
  res.status(StatusCodes.OK).json({
    status: "success",
    length: foods.length,
    data: { foods },
  });
};

const vendorResponse = (
  res: Response,
  restaurant: VendorDocument | VendorDocument[] | OfferDocument[]
) => {
  res.status(StatusCodes.OK).json({
    status: "success",
    length: Array.isArray(restaurant) ? restaurant.length : undefined,
    data: { restaurant },
  });
};

const findFoodWithinPincode = async (
  req: Request,
  next: NextFunction,
  serviceAvailable?: boolean
): Promise<PopulatedVendorDocument[] | void> => {
  const pincode = req.params.pincode;

  if (!pincode) {
    return next(new AppError("There's no picode provided", StatusCodes.BAD_REQUEST));
  }

  const query: VendorQuery = { pincode };
  if (serviceAvailable !== undefined) {
    query.serviceAvailable = serviceAvailable as boolean;
  }

  const vendorWithPincode = await Vendor.find(query)
    .sort([["rating", "descending"]])
    .populate<{ foods: FoodDocument[] }>({
      path: "foods",
      model: Food,
    });

  if (vendorWithPincode.length === 0) {
    return next(new AppError("There's no restourants with this pincode", StatusCodes.NOT_FOUND));
  }
  return vendorWithPincode as PopulatedVendorDocument[];
};

const extractFoodsFromVendors = (vendors: PopulatedVendorDocument[]) => {
  const foodResult: FoodDocument[] = [];

  vendors.forEach((vendor) => {
    const foods = vendor.foods as FoodDocument[];
    const food = foods.map((food) => food);
    foodResult.push(...food);
  });
  return foodResult;
};

export const getFoodAvailability = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await findFoodWithinPincode(req, next, true);

    if (!vendors) return;

    const foodResult = extractFoodsFromVendors(vendors);

    foodsResponse(res, foodResult);
  }
);

export const searchFood = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const vendors = await findFoodWithinPincode(req, next);

  if (!vendors) return;

  const foodResult = extractFoodsFromVendors(vendors);

  foodsResponse(res, foodResult);
});

export const getFoodIn30Minutes = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await findFoodWithinPincode(req, next);

    if (!vendors) return;

    const foodResult: FoodDocument[] = [];

    vendors.forEach((vendor) => {
      const foods = vendor.foods as FoodDocument[];
      const foodsIn30Minutes = foods.filter((food) => food.readyTime <= 30);
      foodResult.push(...foodsIn30Minutes);
    });

    foodsResponse(res, foodResult);
  }
);

export const getRestourantsById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const restaurant = await Vendor.findById(req.params.id);

    if (!restaurant) {
      return next(new AppError("There's no restourants with this pincode", StatusCodes.NOT_FOUND));
    }

    vendorResponse(res, restaurant);
  }
);

export const getTopRestaurants = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;

    if (!pincode) {
      return next(new AppError("There's no picode provided", StatusCodes.BAD_REQUEST));
    }
    const topRestaurants = await Vendor.find({ pincode, serviceAvailable: true })
      .sort([["rating", "descending"]])
      .limit(5);

    if (topRestaurants.length === 0) {
      return next(new AppError("There's no restourants with this pincode", StatusCodes.NOT_FOUND));
    }

    vendorResponse(res, topRestaurants);
  }
);

export const getAvailableOffers = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode as string;

    const offers = await Offer.find({ pincode, isActive: true });
    if (!offers || offers.length === 0) {
      return next(new AppError("There's no offers within this pincode", StatusCodes.NOT_FOUND));
    }

    vendorResponse(res, offers);
  }
);
