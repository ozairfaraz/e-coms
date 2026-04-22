import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    vendorProducts: [],
    products: [],
    productDetails: [],
  },
  reducers: {
    setVendorProducts: (state, action) => {
      state.vendorProducts = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
  },
});

export const { setVendorProducts, setProducts, setProductDetails } = productSlice.actions;

export default productSlice.reducer;
