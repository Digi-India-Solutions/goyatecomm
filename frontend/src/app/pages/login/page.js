"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/redux/features/auth/loginSlice";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail } from "lucide-react";
import stylebanner from "../../Images/DBS/stylebanner.webp";
import Link from "next/link";
import Image from "next/image";
import {
  addToWishlistApi,
  MultipleAddToWishlist,
} from "@/app/redux/wishlistSlice";
import { addToCartAPIThunk } from "@/app/redux/AddtoCart/apiCartSlice";
// import '../../pages/login/forgot-password/page'
const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { user, loading, error } = useSelector((state) => state.login);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      toast.success("Login successful!");

      if (cartItems.length > 0) {
        const cartItemsWithQuantity = cartItems.map((item) => ({
          productId: item.productId ?? item.id,
          quantity: item.quantity,
        }));
        await dispatch(addToCartAPIThunk(...cartItemsWithQuantity));
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cart");
      }
      if (wishlistItems?.length > 0) {
        console.log("wishlistItems:", wishlistItems);

        await dispatch(
          MultipleAddToWishlist(wishlistItems.map((item) => item.id))
        );
        localStorage.removeItem("wishlistItems");
      }

      setEmail("");
      setPassword("");
      router.push("/");
    } catch (err) {
      console.log("Login error:", err);

      toast.error(err || err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="w-full relative overflow-hidden group h-[200px]">
        <Image
          src={stylebanner}
          alt="Login banner background"
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Welcome Back
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <Link
                href="/"
                className="hover:text-white font-medium transition"
              >
                Home
              </Link>
              <span className="text-white/70">/</span>
              <span className="font-medium">Login</span>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-300">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-dark">Sign In</h2>
              <p className="text-gray-600 mt-1">
                Access your account and manage your orders
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-3 pr-10 py-3 w-full border border-gray-300 rounded-lg"
                      placeholder="your@email.com"
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 green h-5 w-5" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <Link
                      href="/pages/login/forgot-password"
                      className="text-sm green hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-3 pr-10 py-3 w-full border border-gray-300 rounded-lg"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 green"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 green border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full black-btn"
                >
                  {loading && (
                    <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  )}
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>

          {/* Benefits Section */}
          <div
            className="rounded-xl shadow-lg p-8 border border-gray-300"
            style={{
              backgroundImage:
                "linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%)",
            }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black">New Customer?</h2>
              <p className="text-gray-600 mt-1">
                Create an account for faster checkout and order tracking
              </p>
            </div>

            <ul className="space-y-4">
              {[
                {
                  title: "Faster checkout",
                  desc: "Save your shipping and payment details for quick checkout",
                },
                {
                  title: "Order history",
                  desc: "Track your orders and view order history",
                },
                {
                  title: "Special offers",
                  desc: "Get personalized offers and exclusive discounts",
                },
                {
                  title: "Wishlist",
                  desc: "Save items to your wishlist for later",
                },
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <span className="green text-xs">✓</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-black">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/pages/signup"
              className="mt-4 text-center block w-full purple-btn"
            >
              Create Account
            </Link>

            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-300 text-sm text-gray-600 text-center">
              <span className="font-medium">Secure Shopping Guarantee</span>:
              Your data is encrypted and secure with us.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
