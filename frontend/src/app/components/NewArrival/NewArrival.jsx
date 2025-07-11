"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/app/redux/AddtoCart/cartSlice";
import {
  addToWishlist,
  addToWishlistApi,
  addToWishlistState,
  removeFromWishlist,
  removeFromWishlistApi,
  removeFromWishlistState,
} from "@/app/redux/wishlistSlice";
import axiosInstance, { serverUrl } from "@/app/redux/features/axiosInstance";
import {
  addToCartAPIThunk,
  addtoCartState,
} from "@/app/redux/AddtoCart/apiCartSlice";
import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";
import { verifyUser } from "@/app/redux/features/auth/loginSlice";

const NewArrival = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { items: apiCartItems } = useSelector((state) => state.apiCart);
  const user = useSelector((state) => state.login.user);

  let cartItemsValue = [];
  if (user?.email) {
    cartItemsValue = apiCartItems;
  } else {
    cartItemsValue = cartItems;
  }

  useEffect(() => {
    dispatch(verifyUser());
  }, [dispatch]);

  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const handleAddToCart = async (product) => {
    const exists = cartItems.some((item) => item.id === product._id);
    const insideApiExists = apiCartItems.some(
      (item) => item.productId?._id === product._id
    );

    const cartItem = {
      id: product._id,
      name: product.title,
      image: product.images[0],
      price: product.finalPrice,
      finalPrice: product.finalPrice,
      quantity: 1,
    };

    if (!user && !user?.email) {
      try {
        await dispatch(addToCart(cartItem));

        toast.success(
          exists
            ? "Quantity updated in your cart!"
            : `Great choice! ${product.title} added.`
        );
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Cart error:", error);
      }
    } else {
      dispatch(addtoCartState({ id: product._id }));
      dispatch(addToCartAPIThunk({ productId: product._id, quantity: 1 }));
      toast.success(
        insideApiExists
          ? "Quantity updated in your cart!"
          : `Great choice! ${product.title} added.`
      );
    }
  };
  const handleAddToWishlist = (_id, title, images, finalPrice, price) => {
    if (user?.email) {
      const isAlreadyInWishlist = wishlistItems.some(
        (item) => item._id === _id
      );
      if (isAlreadyInWishlist) {
        dispatch(removeFromWishlistState(_id));
        dispatch(removeFromWishlistApi(_id));
        toast.error("Remove from wishlist.");
      } else {
        dispatch(addToWishlistState({ _id }));
        dispatch(addToWishlistApi({ productId: _id }));
        toast.success(`"${title}" added to wishlist.`);
      }
    } else {
      const isAlreadyInWishlist = wishlistItems?.some(
        (item) => item.id === _id
      );
      if (isAlreadyInWishlist) {
        dispatch(removeFromWishlist(_id));
        toast.error("removed from wishlist.");
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

  const swiperRef = useRef(null);

  const [products, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const newArrivals = async () => {
      try {
        const response = await axiosInstance.get("/product/get-new-arrival");
        setProduct(response.data.products);
      } catch (err) {
        setError("Failed to load New Arrival product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    newArrivals();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse space-y-3 border border-gray-200 rounded-lg shadow p-4"
          >
            {/* Image skeleton */}
            <div className="w-full h-40 bg-gray-300 rounded-md"></div>

            {/* Title skeleton */}
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>

            {/* Price skeleton */}
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!products) {
    return (
      <div className="text-center text-gray-500">
        {loading ? "Loading..." : "Product not found."}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          New Arrival products
        </h2>
        {/* <Link href="/pages/">
          <button className="view-all-btn">
            View All
            <ArrowRight size={16} />
          </button>
        </Link> */}
      </div>

      <div
        onMouseEnter={() => swiperRef.current?.swiper.autoplay.stop()}
        onMouseLeave={() => swiperRef.current?.swiper.autoplay.start()}
      >
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Autoplay]}
          spaceBetween={10}
          navigation
          loop={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
        >
          {products.map((product) => {
            const isInCart = user?.email
              ? apiCartItems.some(
                (item) => item?.productId?._id === product._id
              )
              : cartItems.some((item) => item.id === product._id);

            return (
              <SwiperSlide key={product._id}>
                <div className="border border-gray-300 p-2 rounded-lg relative bg-white">
                  {typeof product.discount === "number" &&
                    product.discount > 0 && (
                      <div className="absolute top-2 left-0 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-e-2xl z-10">
                        {product.discount}%
                      </div>
                    )}

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
                    {(
                      user?.email
                        ? wishlistItems?.some(
                          (item) => item?._id === product._id
                        )
                        : wishlistItems?.some((item) => item.id === product._id)
                    ) ? (
                      "❤️"
                    ) : (
                      <Heart size={16} />
                    )}
                  </div>

                  <Link href={`/pages/shop/${product._id}`}>
                    <div className="w-50 h-60 flex justify-center m-auto items-center mb-2">
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

                  <Link href={`/pages/shop/${product._id}`}>
                    <h3 className="mt-2 text-sm md:text-md font-normal md:font-semibold line-clamp-1 ">
                      {product.title}
                    </h3>
                    <h3 className="mt-1 text-sm text-gray-800 font-semibold italic line-clamp-1">
                    {product.pages}
                    </h3>
                  </Link>

                  <div className="text-md md:text-lg font-bold text-red-600">
                    ₹{product.finalPrice}
                  </div>
                  {typeof product.discount === "number" &&
                    product.discount > 0 && (
                      <div className="text-sm text-gray-800 font-bold line-through">
                        ₹ {product.price}
                      </div>
                    )}
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
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default NewArrival;
