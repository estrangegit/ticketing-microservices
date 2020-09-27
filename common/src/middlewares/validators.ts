import { body, param } from 'express-validator';
import mongoose from 'mongoose';

export const validateMongoIdParam = (paramName: string) => {
  return param(paramName)
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage(
      `${paramName} must be provided and must be a valid mongodb Id`
    );
};

export const validateMongoIdBodyElement = (bodyElement: string) => {
  return body(bodyElement)
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage(
      `${bodyElement} must be provided and must be a valid mongodb Id`
    );
};
