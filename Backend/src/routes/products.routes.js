import express from "express";
import {
  authenticateUser,
  authenticateVendor,
} from "../middleware/auth.middleware.js";
import { validateProductRequest } from "../validator/product.validator.js";
import { multerUpload } from "../config/multer.js";
import {
  createProductController,
  getAllProductsController,
  getAllVendorProductController,
} from "../controller/product.controller.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  authenticateVendor,
  multerUpload.array("images", 7),
  validateProductRequest,
  createProductController,
);

productRouter.get(
  "/allProducts",
  authenticateVendor,
  getAllVendorProductController,
);

productRouter.get("/", authenticateUser, getAllProductsController);

export default productRouter;
