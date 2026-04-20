import axios from "axios";

const productApiInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

export const getAllProducts = async () => {
  const response = await productApiInstance.get("/allProducts");
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await productApiInstance.post("/", formData);
  return response.data;
};
