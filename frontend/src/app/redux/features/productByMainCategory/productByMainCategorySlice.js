import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export const fetchProductsByMainCategory = createAsyncThunk(
  "productByMainCategory/fetchProductsByMainCategory",
  async ({ limit = 50, page = 1,subcategoryId }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/product/product-by-main-category/${subcategoryId}?limit=${limit}&page=${page}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

const productByMainCategorySlice = createSlice({
  name: "productByCategory",
  initialState: {
    products: [],
    totalPages: 0,
    loading: false,
    error: null,
  },
  reducers: {
    latest: (state) => {
      state.products = state.products.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
    highToLow: (state) => {
      state.products = state.products.sort(
        (a, b) => b.price - a.price
      );
    },
    lowToHigh: (state) => {
      state.products = state.products.sort(
        (a, b) => a.price - b.price
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByMainCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByMainCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload?.products;
        state.totalPages = action.payload?.totalPages;
      })
      .addCase(fetchProductsByMainCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  latest,
  highToLow,
  lowToHigh,
} = productByMainCategorySlice.actions;

export default productByMainCategorySlice.reducer;
