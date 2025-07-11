import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

// ✅ Async Thunk to fetch banners
export const fetchBanners = createAsyncThunk(
  "banners/fetchBanners",
  async () => {
    const response = await axiosInstance.get("/banner/get-all-banners");
    return response.data;
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bannerSlice.reducer;
