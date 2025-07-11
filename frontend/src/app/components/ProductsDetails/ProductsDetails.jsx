"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import QR from "../../Images/DBS/QR.png";
import book1 from "../../Images/DBS/1.jpg";
import {
  BookOpenText,
  CheckCheck,
  ChevronsLeft,
  Globe,
  Heart,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { addToCart } from "@/app/redux/AddtoCart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance, { serverUrl } from "@/app/redux/features/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";

import fastdelivery from "../../Images/DowloadImage/fast-delivery.png";
import bestprice from "../../Images/DowloadImage/best-price.png";
import wide from "../../Images/DowloadImage/Wide.png";
import { Parser } from "html-to-react";
import {
  addToCartAPIThunk,
  addtoCartState,
} from "@/app/redux/AddtoCart/apiCartSlice";
import {
  addToWishlist,
  addToWishlistApi,
  addToWishlistState,
  removeFromWishlist,
  removeFromWishlistApi,
  removeFromWishlistState,
} from "@/app/redux/wishlistSlice";
import ISBNBarcode from "../ISBNBarcode/ISBNBarcode";
export default function ProductDetails() {
  // Api for show ingle prodict data

  const [activeTab, setActiveTab] = useState("details");
  // const [selectedImage, setSelectedImage] = useState(
  //   book.coverImage || "/placeholder.svg"
  // );
  // const [fade, setFade] = useState(false);

  // useEffect(() => {
  //   setFade(true);
  //   const timer = setTimeout(() => setFade(false), 200); // match transition duration
  //   return () => clearTimeout(timer);
  // }, [selectedImage]);
  const htmlParser = new Parser();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { items: apiCartItems } = useSelector((state) => state.apiCart);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  console.log("wishlistItems:", wishlistItems);

  const handleAddToCart = async (product) => {
    const exists = cartItems.some((item) => item.id === product._id);
    const insideApiExists = apiCartItems.some(
      (item) => item.productId?._id === product._id
    );

    const cartItem = {
      id: product._id,
      name: product.title,
      image: product?.images[0],
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
            : Great choice! ${product.title} added.
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
          : Great choice! ${product.title} added.
      );
    }
  };

  const handleAddToWishlist = (_id, title, images, finalPrice, price) => {
    if (user?.email) {
      const isAlreadyInWishlist = wishlistItems?.some(
        (item) => item._id === _id
      );
      if (isAlreadyInWishlist) {
        dispatch(removeFromWishlistState(_id));
        dispatch(removeFromWishlistApi(_id));
        toast.error("Remove from wishlist.");
      } else {
        dispatch(addToWishlistState({ _id }));
        dispatch(addToWishlistApi({ productId: _id }));
        toast.success("${title}" added to wishlist.);
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
        toast.success("${title}" added to wishlist.);
      }
    }
  };

  const router = useRouter();

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    router.push("/pages/checkout");
  };
  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "Check out this product!",
          text: I found this amazing book on GOYAT TRADING,
          url: window.location.href,
        })
        .then(() => toast.success("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert(
        "Sharing not supported in this browser. You can copy the link manually."
      );
    }
  };

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const id = params.id;

  // console.log("Product data:", book);

  useEffect(() => {
    if (!id) return;

    const fetchProductDetail = async () => {
      try {
        const response = await axiosInstance.get(/product/get-product/${id});
        setBook(response.data.product);
        console.log("Product data:=>", response?.data?.product?.images);
      } catch (err) {
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!book) {
    return (
      <div className="text-center text-gray-500">
        {loading ? "Loading..." : "Product not found."}
      </div>
    );
  }
  // console.log("Product data:=>", ${serverUrl}/public/image/${book?.images[0]});
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}

      <div className="mb-6">
        <Link
          href="/pages/shop"
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronsLeft />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          {/* Main Image */}

          <div className="border border-green-500 rounded-lg overflow-hidden bg-white p-4 flex items-center justify-center h-[440px]">
            <Image
              // src={book1}
              src={
                book?.images?.[0]
                  ? ${serverUrl}/public/image/${book?.images[0]}
                  : CallBackImg
              }
              className="h-[415px] object-cover hover:scale-97 rounded-lg transition-transform duration-300"
              width={500}
              height={500}
              alt={book?.title}
              zoom={2}
            />
          </div>

          {/* Preview Thumbnails */}
          {/* <div className="grid grid-cols-4 gap-2">
            {[book.coverImage, ...book.previewImages].map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(image || "/placeholder.svg")}
                className={`border rounded-lg overflow-hidden bg-white p-2 cursor-pointer transition-colors ${
                  selectedImage === image
                    ? "border-green-800"
                    : "border-green-600 hover:border-green-800"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={${book.title} preview ${index + 1}}
                  width={100}
                  height={150}
                  className="object-cover aspect-[2/3]"
                />
              </div>
            ))}
          </div> */}
        </div>

        {/* Middle Column - Book Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{book.title}</h1>
                {/* <p className="text-lg text-gray-500">by {book.author}</p> */}
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-2 cursor-pointer border border-green-600 rounded-md hover:bg-green-100"
                  onClick={() =>
                    handleAddToWishlist(
                      book._id,
                      book.title,
                      book?.images[0],
                      book.finalPrice,
                      book.oldPrice
                    )
                  }
                >
                  {(
                    user?.email
                      ? wishlistItems?.some((item) => item?._id === book._id)
                      : wishlistItems?.some((item) => item.id === book._id)
                  ) ? (
                    "❤"
                  ) : (
                    <Heart size={20} />
                  )}
                  <span className="sr-only cursor-pointer">
                    Add to wishlist
                  </span>
                </button>
                <button
                  className="p-2 border cursor-pointer border-green-600 rounded-md hover:bg-green-100"
                  onClick={handleShare}
                >
                  <Share2 />
                  <span className="sr-only">Share</span>
                </button>
              </div>
            </div>

            {/* <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(book.rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-500 fill-gray-500"
                    }`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <Star />
                  </div>
                ))}
                <span className="ml-2 text-sm font-medium">{book.rating}</span>
              </div>
              <span className="text-sm text-gray-500">
                ({book.reviewCount} reviews)
              </span>
            </div> */}

            {/* <div className="flex flex-wrap gap-2 mt-3">
              {book.category.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div> */}
            {/* {book?.category && book?.category?.SubCategoryName && (
              <div className="flex flex-wrap gap-2 mt-3">
                <Link
                  href={/pages/shop/productBysubcategory/${book?.category?._id}}
                >
                  <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {book?.category?.SubCategoryName}
                  </span>
                </Link>
              </div>
            )} */}
          </div>
          <div className=" rounded-lg overflow-hidden">
            <div className="p-3">
              <div className="">
                {/* <h3 className="font-bold">
                  Description
                </h3> */}
                <p>{htmlParser.parse(book.description)}</p>
                {/* <div className="flex justify-center">
                  <div className="bg-white p-3 rounded-lg">
                    <Image src={QR} alt="QR Code" width={180} height={180} />
                    <ISBNBarcode isbn={book.ISBN13} />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <hr className="border-green-400" />

          <div>
            <div>
              <div className="flex items-center gap-2">
                prices:{" "}
                <span className="text-2xl  text-green-600 font-bold">
                  ₹{book.finalPrice?.toFixed()}
                </span>
                <span className="font-medium line-through">₹{book.price?.toFixed()}</span>
              </div>
              <span className="text-[12px] text-red-700">
                (Inclusive of all taxes)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* <div className="rounded-lg p-2 border-2  cursor-pointer border-green-600 ransition-colors">
                <div className="text-center">
                  <div className="font-medium">INR</div>
                  <div className="text-2xl font-bold mt-1">
                    ₹{book.price?.toFixed()}
                  </div>
                </div>
              </div> */}
              {/* <div className=" border-2  rounded-lg p-2  cursor-pointer border-green-600 ransition-colors">
                <div className="text-center">
                  <div className="font-medium">USD</div>
                  <div className="text-2xl font-bold mt-1">
                    ${book?.priceInDollors?.toFixed() || "N/A"}
                  </div>
                </div>
              </div>
              <div className="border-2  rounded-lg p-2 cursor-pointer border-green-600 ransition-colors">
                <div className="text-center">
                  <div className="font-medium">EURO</div>
                  <div className="text-2xl font-bold mt-1">
                    £{book?.priceInEuros?.toFixed() || "N/A"}
                  </div>
                </div>
              </div> */}
            </div>

            {/* <div className="flex items-center text-sm text-gray-700">
              <BookOpenText />

              <span>
                Hardcover · {book.pages} pages · {book.language}
              </span>
            </div> */}

            {/* <div className="flex items-center text-sm">
              <span
                className={`font-medium ${
                  book.stock > 10
                    ? "text-green-600"
                    : book.stock > 0
                    ? "text-amber-600"
                    : "text-red-600"
                }`}
              >
                {book.stock > 10
                  ? "In Stock"
                  : book.stock > 0
                  ? Only ${book.stock} left
                  : "Out of Stock"}
              </span>
            </div> */}
            {book?.stock === 0 && (
              <div className="w-full flex items-center gap-2 p-3 text-sm text-white bg-gradient-to-r from-red-600 to-red-500 rounded shadow-sm">
                <i className="fa-solid fa-ban text-white"></i>
                <span>Sorry! This book is currently out of stock.</span>
              </div>
            )}
          </div>
          {book?.stock > 0 && (
            <div className="flex flex-col space-y-3">
              <button
                className={`${
                  cartItems.some((item) => item.id === book.id)
                    ? "w-full bg-black text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center cursor-pointer"
                    : "w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                }`}
                onClick={() => handleAddToCart(book)}
              >
                {cartItems.some((item) => item.id === book.id) ? (
                  <>
                    <span className="flex cursor-pointer">
                      Added to cart <CheckCheck />
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex cursor-pointer">
                      <ShoppingCart /> Add to cart
                    </div>
                  </>
                )}
              </button>
              {/* <Link href={"/pages/checkout"}> */}
              <button
                className="cursor-pointer w-full border border-gray-500 hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors"
                onClick={() => handleBuyNow(book)}
              >
                Buy Now
              </button>
              {/* </Link> */}
            </div>
          )}

          {/* <div className="text-sm text-gray-700">
            <p>
              <b>ISBN-10:</b> {book.ISBN}
            </p>
            <p>
              <b>Publisher:</b> {book.publisher}
            </p>
            <p>
              <b>Publication Date:</b> {book.publicationDate}
            </p>
          </div> */}
        </div>

        {/* Right Column - Description and QR Code */}
        <div className="space-y-6">
          <div>
            <div className="flex border-b border-green-700">
              {/* <button
                className="px-4 py-2 font-medium text-sm border-r border-gray-300 text-black hover:green"
                onClick={() => setActiveTab("description")}
              >
                Description
              </button> */}
              {/* <button
                className="px-4 py-2 font-medium text-sm text-black border-r border-gray-300 hover:green"
                onClick={() => setActiveTab("highlights")}
              >
                Highligths
              </button> */}
              <button
                className="px-4 py-2 font-medium text-sm text-black hover:green"
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
            </div>

            <div className="mt-4">
              {/* {activeTab === "description" && (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed">
                    {htmlParser.parse(book.description)}
                  </p>
                </div>
              )} */}

              {activeTab === "details" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {/* <div className="font-medium mb-2">Key Features:</div>
                    <div>{book?.author || "N/A"}</div>

                    <div className="font-medium">Unit:</div>
                    <div>{book?.pages}</div>
                    <div className="font-medium">Country of Origin:</div>
                    <div>{book?.language}</div>

                    <div className="font-medium">Brand:</div>
                    <div>{book?.ISBN || "N/A"}</div>

                    <div className="font-medium">Expiry Date:</div>
                    <div>{book?.publisher || "N/A"}</div>

                    <div className="font-medium">Manufacturer:</div>
                    <div>{book?.publicationDate || "N/A"}</div> */}
                    <div>
                      {book?.details && (
                         <p className="text-sm leading-relaxed">
                    {htmlParser.parse(book.details)}
                  </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* {activeTab === "highlights" && (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed">{book.highlights}</p>
                </div>
              )} */}
            </div>
          </div>
          {/* {activeTab === "description" && (
          
          )} */}

         
        </div>
       

      </div>
       <div className="mt-6 w-full">
  <h3 className="font-bold text-xl mb-6">
    Why shop from Goyat Trading?
  </h3>

  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Feature 1 */}
    <div className="flex items-start space-x-4 w-full">
      <Image
        src={fastdelivery}
        alt="Superfast Delivery"
        className="w-12 h-12 object-contain"
      />
      <div>
        <h4 className="font-semibold text-sm">Superfast Delivery</h4>
        <p className="text-sm text-gray-600">
          Get your order delivered to your doorstep at the earliest from dark
          stores near you.
        </p>
      </div>
    </div>

    {/* Feature 2 */}
    <div className="flex items-start space-x-4 w-full">
      <Image
        src={bestprice}
        alt="Best Prices & Offers"
        className="w-12 h-12 object-contain"
      />
      <div>
        <h4 className="font-semibold text-sm">Best Prices & Offers</h4>
        <p className="text-sm text-gray-600">
          Best price destination with offers directly from the manufacturers.
        </p>
      </div>
    </div>

    {/* Feature 3 */}
    <div className="flex items-start space-x-4 w-full">
      <Image
        src={wide}
        alt="Wide Assortment"
        className="w-12 h-12 object-contain"
      />
      <div>
        <h4 className="font-semibold text-sm">Wide Assortment</h4>
        <p className="text-sm text-gray-600">
          Choose from 5000+ products across food, personal care, household &
          other categories.
        </p>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}