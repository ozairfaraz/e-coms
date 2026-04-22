import { useDispatch } from "react-redux";
import {
  createProduct,
  getAllProducts,
  getAllVendorProducts,
  getProductDetails,
} from "../services/product.api";
import {
  setProductDetails,
  setProducts,
  setVendorProducts,
} from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  const handleGetAllVendorProducts = async () => {
    const data = await getAllVendorProducts();
    dispatch(setVendorProducts(data.products));
    return data.products;
  };

  const handleCreateProduct = async (formData) => {
    const data = await createProduct(formData);
    return data.products;
  };

  const handleGetAllProducts = async () => {
    const data = await getAllProducts();
    dispatch(setProducts(data.products));
  };

  const handleGetProductDetails = async (productId) => {
    const data = await getProductDetails(productId);
    dispatch(setProductDetails(data.product));
  };

  return {
    handleGetAllVendorProducts,
    handleCreateProduct,
    handleGetAllProducts,
    handleGetProductDetails,
  };
};
