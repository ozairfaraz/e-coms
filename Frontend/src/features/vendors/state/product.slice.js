import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    vendorProducts: [],
  },
  reducers: {
    setVendorProducts: (state, action) => {
      state.vendorProducts = action.payload;
    },
  },
});

export const { setVendorProducts } = productSlice.actions;

export default productSlice.reducer;
