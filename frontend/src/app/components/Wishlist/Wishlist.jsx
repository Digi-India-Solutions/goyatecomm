"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllWishlistItemsApi,
  removeFromWishlist,
  removeFromWishlistApi,
  removeFromWishlistState,
} from "@/app/redux/wishlistSlice";
import { BadgeX } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import EmptywishList from "../../Images/DowloadImage/EmptyWishList.jpg";
import { addToCart } from "@/app/redux/AddtoCart/cartSlice";
import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";

import Link from "next/link";
import {
  addToCartAPIThunk,
  addtoCartState,
  getAllCartItemsAPI,
  removeFromCartAPI,
  removeFromCartState,
  updateStateQuantity,
} from "@/app/redux/AddtoCart/apiCartSlice";
import { serverUrl } from "@/app/redux/features/axiosInstance";
const Wishlist = () => {
  const {wishlistItems,loading} = useSelector((state) => state.wishlist);
  const { cartItems } = useSelector((state) => state.cart);
  const { items } = useSelector((state) => state.apiCart);
  const { user } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  let cartItemsValue = [];

  if (user?.email) {
    cartItemsValue = items;
  } else {
    cartItemsValue = cartItems;
  }

  const handleAddToCart = (id, name, image, price) => {
    if (user?.email) {
      dispatch(updateStateQuantity({ id: id, quantity: 1 }));
      dispatch(addtoCartState({ id: id }));
      dispatch(addToCartAPIThunk({ productId: id, quantity: 1 }));
    } else {
      dispatch(
        addToCart({
          id: id,
          name: name,
          image: image,
          price: price,
          totalPrice: price,
        })
      );
    }

    if (cartItems.some((item) => item.id === id)) {
      toast.success("Quantity updated in your cart!");
    } else {
      toast.success(`"Great choice! ${name} added."`);
    }
  };

  const handleRemoveFromWishlist = (id, name) => {
    if (user?.email) {
      dispatch(removeFromWishlistState(id));
      dispatch(removeFromWishlistApi(id));
      toast.error(`"${name}" removed from wishlist`);
    } else {
      dispatch(removeFromWishlist(id));
      toast.error(`"${name}" removed from wishlist`);
    }
  };

  useEffect(() => {
    if(!user?.email) return;
    if (user?.email) {
      dispatch(getAllWishlistItemsApi());
    }
  }, [dispatch, user?.email]);
  
if (loading) {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">My Wishlist</h2>

      <table className="min-w-full table-auto border-separate border-spacing-y-0">
        <thead>
          <tr className="text-left text-sm text-black font-bold">
            <th className="py-3">Image</th>
            <th className="py-3">Product</th>
            <th className="hidden md:table-cell py-3">Price</th>
            <th className="py-3">Actions</th>
          </tr>
        </thead>

        {wishlistItems?.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan="4" className="text-center py-8">
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src={EmptywishList} // ✅ Replace with your image path
                    alt="Empty Wishlist"
                    className="w-45 h-45 object-contain mb-2 opacity-100"
                  />
                  <p className="green text-lg font-bold">
                    Your wishlist is empty.
                  </p>
                  <p className="text-sm text-black font-semibold">
                    Start exploring and add items you love!
                  </p>
                  <Link href="/">
                    <button className="mt-4 purple-btn">
                      Back to Shopping
                    </button>
                  </Link>
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {wishlistItems?.map((wishItem) => (
              <tr
                key={wishItem?._id ?? wishItem?._id}
                className="hover:bg-gray-100 transition border-b"
              >
                {/* Image */}
                <td className="py-4 pr-2">
                  <Image
                    src={
                      wishItem?.image
                        ? `${serverUrl}/public/image/${wishItem.image}`
                        : wishItem?.images?.[0]
                        ? `${serverUrl}/public/image/${wishItem.images[0]}`
                        : CallBackImg
                    }
                    alt="Product Image"
                    width={60}
                    height={60}
                    className="rounded-md object-contain"
                  />
                </td>

                {/* Product Name */}
                <td className="text-sm font-medium text-gray-800 max-w-xs pr-4">
                  {wishItem?.name ?? wishItem.title}
                </td>

                {/* Price */}
                <td className="hidden md:table-cell text-sm pr-4">
                  <span className="green font-semibold">
                    ₹{wishItem.price}
                  </span>
                  {wishItem.oldPrice && (
                    <span className="text-gray-400 line-through ml-2">
                      ₹{wishItem.oldPrice}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2 md:gap-4">
                    <button
                      className={`${
                        cartItems.some((item) => item.id === wishItem.id)
                          ? "bg-black text-white"
                          : "green hover:bg-purple-700 text-white"
                      } py-1 md:py-2 px-2 md:px-4  text-sm rounded `}
                      onClick={() =>
                        handleAddToCart(
                          wishItem.id ?? wishItem._id,
                          wishItem.name ?? wishItem.title,
                          wishItem.image,
                          wishItem.price
                        )
                      }
                    >
                      {cartItemsValue.some(
                        (item) =>
                          (item?.id ?? item.productId?._id) ===
                          (wishItem?.id ?? wishItem._id)
                      )
                        ? "Added"
                        : "Add to cart"}
                    </button>
                    <button
                      className="text-gray-500 hover:text-red-600"
                      onClick={() =>
                        handleRemoveFromWishlist(
                          wishItem?.id ?? wishItem._id,
                          wishItem?.name ?? wishItem.title
                        )
                      }
                    >
                      <BadgeX size={22} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default Wishlist;
