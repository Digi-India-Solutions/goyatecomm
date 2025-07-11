import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

// Async thunk to fetch categories with banner by level
export const fetchBannerByCategory = createAsyncThunk(
  "bannerByCategory/fetchBannerByCategory",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("level/get-all-levels");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Slice
const bannerByCategorySlice = createSlice({
  name: "bannerByCategory",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBannerByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBannerByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBannerByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bannerByCategorySlice.reducer;
