import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  UserPlus,
  Search,
  LucideHeart,
  BadgeX,
  ShoppingCart,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { verifyUser } from "@/app/redux/features/auth/loginSlice";
import axiosInstance, { serverUrl } from "@/app/redux/features/axiosInstance";
import image1 from "../../Images/DBS/1.jpg"; // fallback image
import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";

export default function BottomNavBar() {
  const [bottombar, setBottomBar] = useState("home");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.login.user);
const localCartCount = useSelector((state) => state.cart.cartItems?.length);
const apiCartCount = useSelector((state) => state.apiCart.items?.length);
  let cartCount =0
  if(user?.email){
    cartCount = apiCartCount
  }else{
    if(localCartCount){
      cartCount = localCartCount
  }
  }
  const wishlistCount = useSelector(
    (state) => state.wishlist.wishlistItems?.length
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyUser());
  }, [dispatch]);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/product/search-products?search=${debouncedTerm}`
        );
        setSearchResults(res.data.products || []);
      } catch (err) {
        console.error("Search API Error:", err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedTerm]);

  const navItems = [
    {
      icon: <Home className="h-6 w-6" />,
      label: "Home",
      href: "/",
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      label: "Cart",
      href: "/pages/cart",
      count: cartCount,
    },
    {
      icon: <Search className="h-6 w-6" />,
      label: "Search",
      type: "search",
    },
    {
      icon: <LucideHeart className="h-6 w-6" />,
      label: "Wishlist",
      href: "/pages/wishlist",
      count: wishlistCount,
    },
    user?.email
      ? {
          icon: <UserPlus className="h-6 w-6" />,
          label: "Profile",
          href: "/pages/userprofile",
        }
      : {
          icon: <UserPlus className="h-6 w-6" />,
          label: "Login",
          href: "/pages/login",
        },
  ];

  return (
    <>
      {/* Mobile Slide-down Search Bar */}
      {showSearchBar && (
        <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-white p-3 shadow-md flex flex-col gap-2 transition-all duration-300">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowSearchBar(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="text-black font-semibold"
            >
              <BadgeX />
            </button>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-purple-700 text-black rounded-full focus:outline-none"
            />
            <Search className="green" h={16} w={16} />
          </div>

          {/* Search Result UI */}
          {searchQuery && (
            <div className="bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto">
              {loading ? (
                <p className="p-4 text-gray-500 text-sm">Loading...</p>
              ) : searchResults?.length > 0 ? (
                searchResults.map((product) => (
                  <Link
                    key={product._id}
                    href={`/pages/shop/${product._id}`}
                    onClick={() => {
                      setShowSearchBar(false);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <Image
                      src={product.images?`${serverUrl}/public/image/${product.images?.[0]}` :CallBackImg }
                      // src={image1}
                      alt={product.title}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="text-sm">
                      <p className="font-medium line-clamp-1">
                        {product.title}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {product.category?.SubCategoryName || "Unknown"} ·{" "}
                        {product.author || "Unknown Author"}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="p-4 text-gray-500 text-sm">No results found.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 z-40 w-full h-16 bg-purple-900 rounded-t-lg md:hidden">
        <div className="grid h-full grid-cols-5 mx-auto">
          {navItems.map((item) => {
            const isSearch = item.type === "search";
            const isActive = bottombar === item.label.toLowerCase();

            if (isSearch) {
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setShowSearchBar(true);
                    setBottomBar(item.label.toLowerCase());
                  }}
                  className="relative -top-4 w-14 h-14 bg-white green rounded-full flex items-center justify-center shadow-lg border-2 border-purple-500 mx-auto"
                >
                  {item.icon}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setBottomBar(item.label.toLowerCase())}
                className="flex flex-col items-center justify-center relative"
              >
                <div className={`${isActive ? "text-blue-400" : "text-white"}`}>
                  {item.icon}
                  {item.count > 0 && (
                    <span className="absolute top-2 right-5 bg-red-500 text-white text-xs px-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    isActive ? "text-blue-400" : "text-white"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
