import express from "express";
import { authenticateVendor } from "../middleware/auth.middleware.js";
import { validateProductRequest } from "../validator/product.validator.js";
import { multerUpload } from "../config/multer.js";
import {
  createProductController,
  getAllProductController,
} from "../controller/product.controller.js";

const productRouter = express.Router();

/**
 * @route POST /api/products
 * @description to create products
 * @access PRIVATE (vendor only)
 */
productRouter.post(
  "/",
  authenticateVendor,
  multerUpload.array("images", 7),
  validateProductRequest,
  createProductController,
);

/**
 * @route GET /api/products/allProducts
 * @description returns all products of the vendor
 * @access Private (vendor only)
 */
productRouter.get("/allProducts", authenticateVendor, getAllProductController);

export default productRouter;
