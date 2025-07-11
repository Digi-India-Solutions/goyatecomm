"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import axiosInstance, { serverUrl } from "@/app/redux/features/axiosInstance";

import { addToCart } from "@/app/redux/AddtoCart/cartSlice";
import {
  addToWishlist,
  addToWishlistApi,
  addToWishlistState,
  removeFromWishlist,
  removeFromWishlistApi,
  removeFromWishlistState,
} from "@/app/redux/wishlistSlice";
import {
  addToCartAPIThunk,
  addtoCartState,
} from "@/app/redux/AddtoCart/apiCartSlice";
import { verifyUser } from "@/app/redux/features/auth/loginSlice";

import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";

const Featureproduct = ({ productlength = 4, btnlength = 8 }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const { cartItems } = useSelector((state) => state.cart);
  const { items: apiCartItems } = useSelector((state) => state.apiCart);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const user = useSelector((state) => state.login.user);

  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cartItemsValue = user?.email ? apiCartItems : cartItems;

  useEffect(() => {
    dispatch(verifyUser());

    const fetchNewArrivals = async () => {
      try {
        const response = await axiosInstance.get("/product/get-featured-books");
        setProduct(response.data.products || []);
      } catch (err) {
        setError("Failed to load New Arrival product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [dispatch]);

  const handleAddToCart = (product) => {
    const isInCart = user?.email
      ? apiCartItems.some((item) => item.productId?._id === product._id)
      : cartItems.some((item) => item.id === product._id);

    const cartItem = {
      id: product._id,
      name: product.title,
      image: product.images[0],
      price: product.finalPrice,
      finalPrice: product.finalPrice,
      quantity: 1,
    };

    if (!user?.email) {
      dispatch(addToCart(cartItem));
      toast.success(
        isInCart
          ? "Quantity updated in your cart!"
          : `Great choice! ${product.title} added.`
      );
    } else {
      dispatch(addtoCartState({ id: product._id }));
      dispatch(addToCartAPIThunk({ productId: product._id, quantity: 1 }));
      toast.success(
        isInCart
          ? "Quantity updated in your cart!"
          : `Great choice! ${product.title} added.`
      );
    }
  };

  const handleAddToWishlist = (_id, title, images, finalPrice, price) => {
    const isInWishlist = user?.email
      ? wishlistItems?.some((item) => item?._id === _id)
      : wishlistItems?.some((item) => item.id === _id);

    if (user?.email) {
      if (isInWishlist) {
        dispatch(removeFromWishlistState(_id));
        dispatch(removeFromWishlistApi(_id));
        toast.error("Removed from wishlist.");
      } else {
        dispatch(addToWishlistState({ _id }));
        dispatch(addToWishlistApi({ productId: _id }));
        toast.success(`"${title}" added to wishlist.`);
      }
    } else {
      if (isInWishlist) {
        dispatch(removeFromWishlist(_id));
        toast.error("Removed from wishlist.");
      } else {
        dispatch(
          addToWishlist({
            id: _id,
            name: title,
            image: images,
            price: finalPrice,
            oldPrice: price,
          })
        );
        toast.success(`"${title}" added to wishlist.`);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse space-y-3 border border-gray-200 rounded-lg shadow p-4"
          >
            <div className="w-full h-40 bg-gray-300 rounded-md"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const visibleProducts =
    products?.length > productlength
      ? products.slice(0, productlength)
      : products;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
          <p className="text-sm max-w-48 md:max-w-full text-gray-500">
            Discover the most popular products of the month at GOYAT TRADING
          </p>
        </div>
        {pathname !== "/pages/featurebook" && (
          <Link href="/pages/featurebook">
            <button className="view-all-btn">
              View All <ArrowRight size={16} />
            </button>
          </Link>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3">
        {visibleProducts.map((product) => {
          const isInCart = cartItemsValue?.some((item) =>
            user?.email
              ? item?.productId?._id === product._id
              : item?.id === product._id
          );

          const isInWishlist = user?.email
            ? wishlistItems?.some((item) => item._id === product._id)
            : wishlistItems?.some((item) => item.id === product._id);

          return (
            <div
              key={product._id}
              className="flex md:flex-row flex-col border border-gray-200 bg-white px-2"
            >
              <div className="relative">
                {/* Discount Badge */}
                {typeof product.discount === "number" &&
                  product.discount > 0 && (
                    <div className="absolute top-2 left-0 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-e-2xl z-10">
                      {product.discount}%
                    </div>
                  )}

                {/* Wishlist Icon */}
                <div
                  className="bg-white text-black absolute top-2 right-3 shadow-md rounded-2xl p-1 cursor-pointer"
                  onClick={() =>
                    handleAddToWishlist(
                      product._id,
                      product.title,
                      product.images[0],
                      product.finalPrice,
                      product.oldPrice
                    )
                  }
                >
                  {isInWishlist ? "❤️" : <Heart size={16} />}
                </div>

                {/* Product Image */}
                <Link href={`/pages/shop/${product._id}`}>
                  <div className="w-30 h-50 lg:w-40 md:w-35 flex justify-center m-auto p-2 items-center mb-2 bg-white">
                    <Image
                      src={
                        product?.images?.[0]
                          ? `${serverUrl}/public/image/${product.images[0]}`
                          : CallBackImg
                      }
                      width={300}
                      height={300}
                      alt={product.title}
                      className="object-contain h-full"
                    />
                  </div>
                </Link>
              </div>

              {/* Product Details */}
              <div className="w-full">
                <Link href={`/pages/shop/${product._id}`}>
                  <h3 className="mt-2 text-sm md:text-md font-normal md:font-semibold line-clamp-2 ">
                    {product.title}
                  </h3>
                  <h3 className="mt-1 text-sm text-gray-800 font-semibold italic line-clamp-1">
                  {product.pages}
                  </h3>
                </Link>

                {/* Price */}
                <div className="mt-2">
                  <div className="text-md md:text-lg font-bold text-red-600">
                    ₹{product.finalPrice}
                  </div>
                  {typeof product.discount === "number" &&
                    product.discount > 0 && (
                      <div className="text-sm text-gray-800 font-bold line-through">
                        ₹ {product.price}
                      </div>
                    )}
                </div>

                {/* Add to Cart Button */}
                   <button
                   style={{cursor: "pointer"}}
                    className={
                      product.stock === 0
                        ? "out-of-stock-btn"
                        : isInCart
                        ? "added-to-cart-btn"
                        : "add-to-cart-btn"
                    }
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0
                      ? "Out of Stock"
                      : isInCart
                      ? "Added"
                      : "Add to cart 🛒"}
                  </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      {products?.length > btnlength && (
        <div className="text-center mt-4">
          <Link href={`/pages/featurebook`}>
            <button className="view-all-btn m-auto">View All</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Featureproduct;
