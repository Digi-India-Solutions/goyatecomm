import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../features/axiosInstance";

// Actual API function to send POST request
const postCartItemToAPI = async (cartItem) => {
  const payload = {
    items: [cartItem],
  };
  const res = await axiosInstance.post("/cart/add-to-cart", payload);
  return res.data;
};

// AsyncThunk for API-based add to cart
export const addToCartAPIThunk = createAsyncThunk(
  "cart/addToCartAPIThunk",
  async (cartItem, { rejectWithValue }) => {
    try {
      const data = await postCartItemToAPI(cartItem);
      return cartItem;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

export const removeFromCartAPI = createAsyncThunk(
  "cart/removeFromCartAPI",
  async (id, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.delete(`/cart/remove-from-cart/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllCartItemsAPI = createAsyncThunk(
  "cart/getAllCartItemsAPI",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axiosInstance.get("cart/get-all-carts");
      return result.data?.carts;
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        return [];
      }

      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    coupon: null,
    loading: false,
    error: null,
  },
  reducers: {
    // LocalStorage version for guests
    resetCartState: (state) => {
      state.items = [];
    },
    addToCart: (state, action) => {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existing) {
        existing.quantity += 1;
        existing.totalPrice = existing.quantity * existing.price;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    addtoCartState: (state, action) => {
      const existing = state.items.find(
        (item) => item?.productId?._id ?? item.productId === action.payload?.id
      );

      if (!existing) {
        state.items.push({
          productId: { _id: action.payload.id },
          quantity: 1,
        });
      }
    },
    removeFromCartState: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productId._id !== action.payload
      );
    },
    updateStateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.productId._id === id);
      if (item && item.quantity >= 1) {
        item.quantity += quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAPIThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAPIThunk.fulfilled, (state, action) => {
        const newItem = action.payload;
        const existing = state.items.find(
          (i) => i.productId._id === newItem.productId
        );

        if (existing) {
          existing.quantity += newItem.quantity || 1;
        } else {
          state.items.push({
            productId: { _id: newItem.productId },
            quantity: 1,
          });
        }

        state.loading = false;

        // Optional: Sync localStorage here if you want persistence
        // localStorage.setItem("cartItems", JSON.stringify(state.items));
      })
      .addCase(addToCartAPIThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCartAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(removeFromCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllCartItemsAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCartItemsAPI.fulfilled, (state, action) => {
        let data = action.payload?.items;
        state.items = data ? data : [];
      })
      .addCase(getAllCartItemsAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addToCart,
  removeFromCartState,
  updateStateQuantity,
  addtoCartState,
  resetCartState,
} = cartSlice.actions;
export default cartSlice.reducer;
