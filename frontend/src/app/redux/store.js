import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./wishlistSlice";
import bannerReducer from "./features/banners/bannerSlice";
import categoryReducer from "./features/getAllCategory/categorySlice";
import signupReducer from "./features/auth/signupSlice";
import loginReducer from "./features/auth/loginSlice";
import productReducer from "./features/shop/shopSlice";
import productByCategoryReducer from "./features/productByCategory/productByCategorySlice";
import productByMainCategoryReducer from "./features/productByMainCategory/productByMainCategorySlice";
import localCartReducer from "./AddtoCart/cartSlice";
import apiCartReducer from "./AddtoCart/apiCartSlice";
import bannerByCategoryReducer from "./features/BannerByCategory/BannerByCategory";
import orderReducer from "./features/order/orderSlice";

export const store = configureStore({
  reducer: {
    cart: localCartReducer, // handles localStorage cart
    apiCart: apiCartReducer,
    wishlist: wishlistReducer,
    banners: bannerReducer,
    category: categoryReducer,
    auth: signupReducer,
    login: loginReducer,
    products: productReducer,
    productByCategory: productByCategoryReducer,
    productByMainCategory: productByMainCategoryReducer,
    bannerByCategory: bannerByCategoryReducer,
    order:orderReducer
  },
});
