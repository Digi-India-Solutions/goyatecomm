// src/redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ limit = 12, page = 1,mainCategory,maxPrice,minPrice }, { rejectWithValue }) => {
    try {
       const params = new URLSearchParams();
      params.append("limit", limit);
      params.append("page", page);

      if (mainCategory) params.append("mainCategory", mainCategory);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      const response = await axiosInstance.get(
        `/product/get-all-products?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Error fetching products");
    }
  }
);

export const fetchCoupons = createAsyncThunk(
  "products/fetchCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/coupon/get-all-coupons`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Error fetching products");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
    products: [],
    coupons:[],
    totalPages: 0,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
