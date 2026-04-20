import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const err = validationResult(req);

  if (!err.isEmpty())
    return res
      .status(400)
      .json({ message: "Invalid product request", error: err.array() });

  next();
}

export const validateProductRequest = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("priceAmount").isNumeric().withMessage("Price amount must be a number"),
  body("priceCurrency").optional().notEmpty().withMessage("Price currency must not be empty"),
  validateRequest,
];
