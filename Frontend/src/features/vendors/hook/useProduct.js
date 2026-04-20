import { useDispatch } from "react-redux";
import { createProduct, getAllProducts } from "../services/product.api";
import { setVendorProducts } from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  const handleGetAllProducts = async () => {
    const data = await getAllProducts();
    dispatch(setVendorProducts(data.products));
    return data.products;
  };

  const handleCreateProduct = async (formData) => {
    const data = await createProduct(formData);
    return data.products;
  };

  return { handleGetAllProducts, handleCreateProduct };
};
