"use client";
import React, { useEffect, useState } from "react";
import {
  LucideUser,
  LucideHeart,
  LucideMapPin,
  LayoutDashboard,
  PhoneCall,
  Send,
  ChevronDown,
  PackageSearch,
  ShoppingCart,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import logo from "../../Images/DowloadImage/logo.png";
import Image from "next/image";
import { LucideMenu, LucideX } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import BottomNavBar from "./BottomNavBar";
import { fetchCategories } from "@/app/redux/features/getAllCategory/categorySlice";
import { verifyUser } from "@/app/redux/features/auth/loginSlice";
import UserLocation from "../UserLocation/UserLocation";
import ProductSearchBar from "./SearchBar";
import { getAllCartItemsAPI } from "@/app/redux/AddtoCart/apiCartSlice";
import { fetchCoupons } from "@/app/redux/features/shop/shopSlice";
import {
  getAllWishlistItemsApi,
  loadWishlistFromStorage,
} from "@/app/redux/wishlistSlice";

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false); // 👈 Safe hydration flag
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState(false);
  const { coupons } = useSelector((state) => state.products);
  const pathname = usePathname();
  // Dropdown items
  const [couponValue, setCouponValue] = useState([]);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const apiCartItems = useSelector((state) => state.apiCart.items);
  const user = useSelector((state) => state.login.user);
  let totalCartItems = [];
  if (user?.email) {
    totalCartItems = apiCartItems?.length;
  } else {
    totalCartItems = cartItems?.length;
  }

  const wishlistCount = useSelector(
    (state) => state.wishlist.wishlistItems?.length
  );

  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(verifyUser());
  }, [dispatch]);
  useEffect(() => {
    if (coupons?.length) {
      const values = coupons
        .filter((coupon) => coupon.isActive === true)
        .map((coupon) => coupon.title);
      setCouponValue(values);
    }
  }, [coupons]);

  useEffect(() => {
    if (pathname === "/") {
      setOpenDropdown(true);
    } else {
      setOpenDropdown(false);
    }
    dispatch(getAllCartItemsAPI());
    dispatch(fetchCoupons());
  }, [pathname]);

    useEffect(() => {
  dispatch(loadWishlistFromStorage());
}, []);

  useEffect(() => {
    if (user === undefined || user === null) return;

    if (user?.email) {
      localStorage.removeItem("wishlistItems");
      dispatch(getAllWishlistItemsApi());
    } 
  }, [user]);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  
  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        Error loading Categories
      </div>
    );
  }



  return (
    <>
      <header className="w-full">
        {/* Top Strip */}
        <div
          style={{ backgroundColor: "var(--purple)" }}
          className=" text-white text-sm py-2"
        >
          <div className="w-full flex flex-col md:flex-row justify-around px-4 text-center md:text-left gap-2 md:gap-0 p2-4">
            <b>
              <Typewriter
                words={
                  Array.isArray(couponValue) && couponValue.length > 0
                    ? couponValue.slice(0, Math.ceil(couponValue.length / 2))
                    : [
                        "FREE delivery on all orders!",
                        "40% Discount for next 3 orders!",
                        "Limited Time Offer — Grab Now!",
                      ]
                }
                loop={0} // 0 = infinite loop
                cursor
                cursorStyle="|"
                typeSpeed={60}
                deleteSpeed={40}
                delaySpeed={2000}
              />
            </b>

            <b>
              <Typewriter
                words={
                  Array.isArray(couponValue) && couponValue.length > 0
                    ? couponValue.slice(Math.ceil(couponValue.length / 2))
                    : [
                        "Sale ends in: 13 days 12 hrs 17 mins 48 sec.",
                        "Hurry! Only a few days left!",
                        "Countdown is running fast!",
                      ]
                }
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={60}
                deleteSpeed={40}
                delaySpeed={2000}
              />
            </b>
          </div>
        </div>

        {/* Secondary Bar */}
        <motion.div
          className="border-b border-gray-300 py-2 px-4 sm:px-6 lg:px-8 hidden md:block"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mx-auto flex flex-wrap justify-between items-center gap-3 text-sm text-gray-600">
            {/* Left Column */}
            <div className="flex gap-4 items-start">
              {/* <a href="/DBSCatalog.pdf" download={true}>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3.5 rounded-full">
                  Download Catalogue
                </button>
              </a> */}
              {/* <Link
                href="/pages/about"
                className="flex flex-col items-center gap-1"
              >
                <Info size={16} />
                <span>About Us</span>
              </Link> */}
            </div>

            {/* Right Column */}
            <div className="flex gap-4 items-start">
              <Link
                href="/pages/contact"
                className="flex flex-col items-center gap-1"
              >
                <PhoneCall size={16} />
                <span>Customer Service</span>
              </Link>
              <Link
                href="/pages/userprofile"
                className="flex flex-col items-center gap-1"
              >
                <PackageSearch size={16} />
                <span>Order Tracking</span>
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="max-w-7xl  mx-auto py-2 hidden md:block"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mx-auto flex flex-wrap justify-between items-center gap-4">
            {/* Logo & Location */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/">
                <Image src={logo} alt="Logo" className="w-20 h-auto" />
              </Link>
              <div className="flex items-center gap-1 text-sm">
                <LucideMapPin style={{backgroundColor:"#4cb051"}} className="w-9 h-9 text-white rounded-full p-2" />
                <UserLocation />
              </div>
            </motion.div>

            {/* Search */}
            <ProductSearchBar />

            {/* Icons */}
            <motion.div
              className="flex gap-4 items-center text-sm"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {!user && !user?.email ? (
                <div
                  className="relative"
                  onMouseEnter={() => setAccount(true)}
                  onMouseLeave={() => setAccount(false)}
                >
                  <div className="flex flex-col items-center cursor-pointer">
                    <LucideUser className="mx-auto w-5 h-5" />
                    <span>Account</span>{" "}
                  </div>

                  <motion.ul
                    className={`absolute top-full left-0 mt-1 w-40 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-200 z-10 ${
                      account ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: account ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {[
                      {
                        label: "LOGIN",
                        href: "/pages/login",
                      },
                      { label: "SIGN UP", href: "/pages/signup" },
                    ].map((item) => (
                      <motion.li key={item.href}>
                        <Link
                          href={item.href}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              ) : (
                <Link
                  href="/pages/userprofile"
                  className="flex flex-col items-center gap-1"
                >
                  <UserCircle className="w-6 h-6 text-black m-auto" />
                  <span>Profile</span>
                </Link>
              )}

              <div className="text-center">
                <Link
                  className="cart-responsive flex items-center justify-center space-x-1 relative"
                  href="/pages/wishlist"
                >
                  <div>
                    <LucideHeart className="w-6 h-6 text-black m-auto" />
                    <span>Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <p className="absolute -top-2 right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                      {wishlistCount}
                    </p>
                  )}
                </Link>
              </div>
              <div className="text-center">
                <Link
                  className="cart-responsive flex items-center justify-center space-x-1 relative"
                  href="/pages/cart"
                >
                  <div>
                    <ShoppingCart className="w-6 h-6 text-black m-auto" />
                    <span>My Cart</span>
                  </div>
                  {totalCartItems > 0 && (
                    <span className="absolute -top-2 right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                      {totalCartItems}
                    </span>
                  )}
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="max-w-7xl border-b border-gray-200 mx-auto hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.nav
            className="bg-white  rounded-lg"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-stretch">
              {/* All Categories */}
              <div
                onClick={() => setOpenDropdown(!openDropdown)}
                className="relative w-[250px] border border-b-0 border-gray-200 rounded-t-[10px] rounded-b-none cursor-pointer flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-2 font-medium">
                  <LayoutDashboard className="w-5 h-5" />
                  All Categories
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openDropdown ? "rotate-180" : ""
                  }`}
                />
                {/* Dropdown */}
                <motion.div
                  className={`absolute top-full left-0 w-full bg-white text-gray-800 border-1 border-gray-200 border-t-0 rounded-b z-30 max-h-[480px] overflow-y-auto transition-all duration-300 ease-in-out ${
                    openDropdown
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                  initial={{ maxHeight: 0, opacity: 0 }}
                  animate={{
                    maxHeight: openDropdown ? 500 : 0,
                    opacity: openDropdown ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.ul
                    className="divide-y divide-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    {loading ? (
                      <div className="flex flex-col gap-2 px-4 py-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div
                            key={index}
                            className="h-6 w-20 bg-gray-300 rounded-full animate-pulse"
                          ></div>
                        ))}
                      </div>
                    ) : (
                      categories.map((item, id) => (
                        <motion.li
                          key={id}
                          className="px-4 py-3 hover:bg-purple-50 cursor-pointer"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Link
                            href={`/pages/categories/${item._id}`}
                          >
                            <p className="font-medium w-full">
                              {item.Parent_name}
                            </p>
                          </Link>
                        </motion.li>
                      ))
                    )}
                  </motion.ul>
                </motion.div>
              </div>

              <motion.ul
                className="flex-1 flex items-center justify-between px-6 py-3 text-gray-700 font-medium text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                {[
                  { label: "Home", url: "/" },
                  { label: "Shop Items", url: "/pages/shop" },
                  { label: "All Categories", url: "/pages/categories" },
                  { label: "Featured Products", url: "/pages/featurebook" },
                  { label: "Best Sellers", url: "/pages/bestSellerbook" },
                  { label: "Contact Us", url: "/pages/contact" },
                  { label: "About Us", url: "/pages/about" },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="hover:green transition font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Link href={item.url} className="flex items-center gap-1">
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.nav>
        </motion.div>

        {/* Mobile responsive navbar */}
        <div className="flex items-center justify-between py-2 px-4 md:hidden bg-white border-b border-gray-300">
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsSidebarOpen(true)}
          >
            <LucideMenu className="w-6 h-6" />
          </button>

          <Link href="/">
            <Image src={logo} alt="Logo" className="w-18 h-18" />
          </Link>

          <Link
            className="cart-responsive flex items-center space-x-1 relative"
            href="/pages/cart"
          >
            <ShoppingCart className="w-6 h-6 text-black" />
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        {/* Sidebar Panel */}
        <div
          className={`fixed top-0 left-0 mb-1 w-full h-dvh overflow-auto bg-white shadow-lg z-50 p-3 transition-transform duration-300 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <Link href="/" onClick={() => setIsSidebarOpen(false)}>
              <Image src={logo} alt="Logo" className="w-24 h-auto" />
            </Link>

            <button onClick={() => setIsSidebarOpen(false)}>
              <LucideX className="w-6 h-6" />
            </button>
          </div>
          <ul className="space-y-4 text-gray-800">
            <li className="border-b-1 border-gray-300 font-medium">
              <Link href="/" onClick={() => setIsSidebarOpen(false)}>
                Home
              </Link>
            </li>
            <li className="border-b-1 border-gray-300 font-medium">
              <Link href="/pages/shop" onClick={() => setIsSidebarOpen(false)}>
                Shop Items
              </Link>
            </li>
            <li className="border-b-1 border-gray-300 font-medium">
              <Link
                href="/pages/categories"
                onClick={() => setIsSidebarOpen(false)}
              >
                Categories
              </Link>
            </li>
            <li className="border-b-1 border-gray-300 font-medium">
              <Link
                href="/pages/featurebook"
                onClick={() => setIsSidebarOpen(false)}
              >
                Featured Products
              </Link>
            </li>
            <li className="border-b-1 border-gray-300 font-medium">
              <Link
                href="/pages/bestSellerbook"
                onClick={() => setIsSidebarOpen(false)}
              >
                Best Sellers
              </Link>
            </li>
            {/* <li className="border-b-1 border-gray-300 font-medium">
              <Link href="/pages/blog" onClick={() => setIsSidebarOpen(false)}>
                Blog
              </Link>
            </li> */}

            {/* <li className="border-b-1 border-gray-300 font-medium">
              <a href="/DBSCatalog.pdf" download={true}>
                <button className="green hover:bg-purple-700 text-white font-medium py-2 px-3.5">
                  Download Catalogue
                </button>
              </a>{" "}
            </li> */}
          </ul>
          <div className="mt-4">
            <p className="font-bold text-gray-400">Category</p>
            <ul className="space-y-4 text-gray-800 max-h-50 overflow-y-auto">
              {categories.map((item) => (
                <li
                  className="border-b border-gray-300 font-medium"
                  key={item._id}
                >
                  <Link
                    href={`/pages/categories/${item._id}`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {item.Parent_name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <p className="font-bold text-gray-400">Cart & Wishlist</p>
            <ul>
              <li>
                <Link
                  href="/pages/wishlist"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/cart"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div className="mt-4">
            <p className="font-bold text-gray-400">GOYAT TRADING Helpers</p>
            <ul>
              <li>
                <Link
                  href="/pages/privacy-policy"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" onClick={() => setIsSidebarOpen(false)}>
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/about"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/contact"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="my-5">
            <p className="font-bold text-gray-400">Contact Details</p>
            <ul>
              <li className="mb-3">
                {/* <Link
                  className="flex gap-2"
                  target="_blank"
                  href="tel:8283863884"
                >
                  <PhoneCall /> 828-3863-884
                </Link> */}
                <div>
                  <span>You can call anytime front 9am to 6pm.</span>
                </div>
              </li>
              <li>
                <Link
                  className="flex gap-2"
                  target="_blank"
                  href="mailto:testing@gmail.com"
                >
                  <Send /> testing@gmail.com
                </Link>
                <div>
                  <span>You can call anytime front 9am to 6pm.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <BottomNavBar />
    </>
  );
};

export default Header;
