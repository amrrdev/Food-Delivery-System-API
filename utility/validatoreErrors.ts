import { ValidationError } from "class-validator";
import { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "./AppError";

export const handleValidationErrors = (errors: ValidationError[], next: NextFunction) => {
  if (errors.length > 0) {
    const formattedErrors = errors
      .map((error) => {
        const propertyErrors = Object.values(error.constraints || {}).join(", ");
        return `${error.property}: ${propertyErrors}`;
      })
      .join("; ");

    return next(new AppError(`Error in user input: ${formattedErrors}`, StatusCodes.BAD_REQUEST));
  }
};
