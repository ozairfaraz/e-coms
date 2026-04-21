import { uploadFile } from "../services/storage.service.js";
import productModel from "../models/product.model.js";

/**
 * @route POST /api/products
 * @description to create products
 * @access private (vendor only)
 */
export const createProductController = async (req, res) => {
  const { title, description, priceAmount, priceCurrency = "INR" } = req.body;
  const vendor = req.user;

  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  if (!title || !description || !priceAmount)
    return res.status(400).json({
      message:
        "Invalid request title, description and priceAmount are mandatory fields",
    });

  const images = await Promise.all(
    req.files.map(async (file) => {
      return await uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      });
    }),
  );

  if (!images)
    return res.status(500).json({ messages: "images upload not successfull" });

  const product = await productModel.create({
    title,
    description,
    price: {
      amount: priceAmount,
      currency: priceCurrency || "INR",
    },
    images,
    vendor: vendor._id,
  });

  res.status(201).json({
    message: "Product created successfully",
    success: true,
    product,
  });
};

/**
 * @route GET /api/products/allProducts
 * @description returns all products of the vendor
 * @access private (vendor only)
 */
export const getAllVendorProductController = async (req, res) => {
  try {
    const vendor = req.user;

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const vendorId = vendor._id;

    const products = await productModel.find({ vendor: vendorId });

    if (!products)
      return res.status(404).json({ message: " No products found" });

    return res.status(200).json({
      message: "All products fetched successfully",
      products,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "fetching products failed", error: error.message });
  }
};

/**
 * @route GET /api/auth/
 * @description returs all products
 * @access public
 */
export const getAllProductsController = async (req, res) => {
  const products = await productModel.find();

  return res
    .status(200)
    .json({ message: "all products fetched successfully", products });
};
