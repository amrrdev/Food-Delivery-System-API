import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../utility/asyncWrapper";
import { VendorOfferInput } from "../dto";
import AppError from "../utility/AppError";
import { StatusCodes } from "http-status-codes";
import { Vendor, VendorDocument } from "../models";
import { Offer, OfferDocument } from "../models/OfferModel";

const checkForVendorAndReturnProfile = async (req: Request, next: NextFunction) => {
  const vendorUser = req.user;

  if (!vendorUser) {
    return next(new AppError("There's no vendor, Please login", StatusCodes.BAD_REQUEST));
  }
  const vendor = await Vendor.findById(vendorUser.id);
  if (!vendor) {
    return next(new AppError("There's no vendor, Please login", StatusCodes.BAD_REQUEST));
  }
  return vendor;
};

export const addOffer = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const vendor = (await checkForVendorAndReturnProfile(req, next)) as VendorDocument;

  const { description, isActive, discountPercentage, offerType, pincode, title } =
    req.body as VendorOfferInput;

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 10); // 10 days from now

  const offer = await Offer.create({
    title,
    description,
    isActive,
    discountPercentage,
    offerType,
    pincode,
    expirationDate,
    vendors: [vendor._id],
  });
  res.status(StatusCodes.OK).json({
    status: "success",
    offer,
  });
});

// Get All offers for this vendor
export const getAllOffers = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendorUser = (await checkForVendorAndReturnProfile(req, next)) as VendorDocument;

    const offers = await Offer.find().populate("vendors");

    if (!offers) {
      return next(new AppError("There's no offers exists", StatusCodes.NOT_FOUND));
    }
    const currentOffers: OfferDocument[] = [];
    offers.forEach((item) => {
      if (item.vendors) {
        item.vendors.forEach((vendor) => {
          if (String(vendor._id) === vendorUser.id) {
            currentOffers.push(item);
          }
        });
      }
      if (item.offerType === "GENERIC") {
        currentOffers.push(item);
      }
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      length: currentOffers.length,
      offers: currentOffers,
    });
  }
);

export const updateOffer = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const vendor = (await checkForVendorAndReturnProfile(req, next)) as VendorDocument;
  const offerId = req.params.id;

  if (!offerId) {
    return next(new AppError("There's no ID provided", StatusCodes.NOT_FOUND));
  }

  const offer = await Offer.findById(offerId);

  if (!offer) {
    return next(new AppError("There's no offer with this ID", StatusCodes.NOT_FOUND));
  }
  const { description, isActive, discountPercentage, offerType, pincode, title } =
    req.body as VendorOfferInput;

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 10); // 10 days from now

  offer.description = description;
  offer.expirationDate = expirationDate;
  offer.isActive = isActive;
  offer.discountPercentage = discountPercentage;
  offer.offerType = offerType;
  offer.pincode = pincode;
  offer.title = title;
  offer.vendors = [vendor._id];
  await offer.save();

  res.status(StatusCodes.OK).json({
    status: "success",
    offer,
  });
});
