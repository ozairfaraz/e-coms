import apiInstance from "../../../config/api";

export const getAllVendorProducts = async () => {
  const response = await apiInstance.get("/products/allProducts");
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await apiInstance.post("/products", formData);
  return response.data;
};

export const getAllProducts = async () => {
  const response = await apiInstance.get("/products");
  return response.data;
};
