import { createSlice } from "@reduxjs/toolkit";

// Helper to load cart from localStorage
function loadCart() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("cart");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      localStorage.removeItem("cart"); // Optional: Clear the invalid data
      return [];
    }
  }
  return [];
}

const initialState = {
  cartItems: loadCart(),
  couponCode: "SAVE10",
  appliedCoupon:{},
  isCouponApplied: false,
  discountAmount: 0,
  tax: 0,
  totalAmount: 0,
  total: 0,
};

export const calculateTotals = (cartItems, couponCode) => {
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0
  );
  const tax = totalAmount * 0.05;
  const discountAmount = couponCode === "SAVE10" ? totalAmount * 0.1 : 0;
  const total = totalAmount + tax - discountAmount;

  return { totalAmount, tax, discountAmount, total, couponCode };
};

const saveCart = (cartItems) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existing = state.cartItems.find((i) => i.id === item.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }

      saveCart(state.cartItems);
      Object.assign(state, calculateTotals(state.cartItems, state.couponCode));
    },

    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      saveCart(state.cartItems);
      Object.assign(state, calculateTotals(state.cartItems, state.couponCode));
    },

    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);
      if (item && quantity >= 1) {
        item.quantity = quantity;
      }
      saveCart(state.cartItems);
      Object.assign(state, calculateTotals(state.cartItems, state.couponCode));
    },
    calculateTotalsLoad: (state) => {
      const totalAmount = state?.cartItems?.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const tax = totalAmount * 0.05;
      const discountAmount =
        state.couponCode === "SAVE10" ? totalAmount * 0.1 : 0;
      const total = totalAmount + tax - discountAmount;

      state.totalAmount = totalAmount;
      state.tax = tax;
      state.discountAmount = discountAmount;
      state.total = total;
    },
    applyCoupon(state, action) {
      state.couponCode = action.payload;
      Object.assign(state, calculateTotals(state.cartItems, action.payload));
    },
    setApplyCoupon(state,action){
      state.appliedCoupon = action.payload;
      state.isCouponApplied = true
    },
    updateCartState(state, action) {
      state.cartItems = action.payload;
      Object.assign(state, calculateTotals(state.cartItems, state.couponCode));
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(addToCartAPI.fulfilled, (state, action) => {
  //       const item = action.payload;
  //       const existing = state.cartItems.find((i) => i.id === item.id);
  //       if (existing) {
  //         existing.quantity += 1;
  //       } else {
  //         state.cartItems.push({ ...item, quantity: 1 });
  //       }

  //       saveCart(state.cartItems);
  //       Object.assign(
  //         state,
  //         calculateTotals(state.cartItems, state.couponCode)
  //       );
  //     })
  //     .addCase(addToCartAPI.rejected, (state, action) => {
  //       console.error("Add to cart API failed:", action.payload);
  //     });
  // },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  calculateTotalsLoad,
  setApplyCoupon,
  updateCartState
} = cartSlice.actions;

export default cartSlice.reducer;
