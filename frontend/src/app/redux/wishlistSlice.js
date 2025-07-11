
import axiosInstance from "./features/axiosInstance";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

// Load wishlist from localStorage
// const loadWishlistFromStorage = () => {
//   try {
//      if (typeof window !== 'undefined') {
//     const data = localStorage.getItem("wishlistItems");
//     return data ? JSON.parse(data) : [];
//      }
//   } catch (error) {
//     console.error("Error loading wishlist from localStorage:", error);
//     return [];
//   }
// };

export const addToWishlistApi = createAsyncThunk(
  "wishlist/addToWishlistApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/wishlist/add-to-wishlist", {
        productIds: [data.productId],
      });
      return response.data;
    } catch (error) {
      console.log("Error adding to wishlist:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
export const MultipleAddToWishlist = createAsyncThunk(
  "wishlist/MultipleAddToWishlist",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/wishlist/add-to-wishlist", {
        productIds:data,
      });
      return response.data;
    } catch (error) {
      console.log("Error adding to wishlist:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
export const removeFromWishlistApi = createAsyncThunk(
  "wishlist/remove-from-wishlist-api",
  async (data, { rejectWithValue }) => {
    try {
      console.log("data", data);

      const response = await axiosInstance.delete(
        `/wishlist/remove-from-wishlist/${data}`
      );
      return;
    } catch (error) {
      console.log("Error adding to wishlist:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getAllWishlistItemsApi = createAsyncThunk(
  "wishlist/getAllWishlistItemsApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/wishlist/get-all-wishlists");
      const data=response.data?.wishlists?.products || [];
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
// Save wishlist to localStorage
const saveWishlistToStorage = (wishlist) => {
  try {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
  } catch (error) {
    console.error("Error saving wishlist to localStorage:", error);
  }
};

const initialState = {
  wishlistItems: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlistState: (state) => {
      state.wishlistItems = [];
    },
    addToWishlist: (state, action) => {
      const exists = state.wishlistItems?.find(
        (item) => item.id === action.payload.id
      );
      if (!exists) {
        state.wishlistItems.push(action.payload);
        saveWishlistToStorage(state.wishlistItems);
      }
    },
    addToWishlistState: (state, action) => {
      const exists = state.wishlistItems.find(
        (item) => item._id === action.payload._id
      );

      if (!exists) {
        state.wishlistItems.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item.id !== action.payload
      );
      saveWishlistToStorage(state.wishlistItems);
    },
    removeFromWishlistState: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item._id !== action.payload
      );
    },
    loadWishlistFromStorage: (state, action) => {
      if (typeof window !== "undefined") {
        const data = localStorage.getItem("wishlistItems");
        state.wishlistItems = data ? JSON.parse(data) : [];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlistApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlistApi.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addToWishlistApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(MultipleAddToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(MultipleAddToWishlist.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(MultipleAddToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllWishlistItemsApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWishlistItemsApi.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload;
      })
      .addCase(getAllWishlistItemsApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromWishlistApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlistApi.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(removeFromWishlistApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  removeFromWishlistState,
  addToWishlistState,
  loadWishlistFromStorage,
  resetWishlistState
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
