import { useDispatch } from "react-redux";
import {
  createProduct,
  getAllProducts,
  getAllVendorProducts,
} from "../services/product.api";
import { setProducts, setVendorProducts } from "../state/product.slice";

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

  return { handleGetAllVendorProducts, handleCreateProduct, handleGetAllProducts };
};
