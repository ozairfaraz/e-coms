import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    vendorProducts: [],
    products: [],
  },
  reducers: {
    setVendorProducts: (state, action) => {
      state.vendorProducts = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setVendorProducts,setProducts } = productSlice.actions;

export default productSlice.reducer;
