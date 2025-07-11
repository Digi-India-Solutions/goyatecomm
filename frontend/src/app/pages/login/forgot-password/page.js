"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import stylebanner from "../../../Images/DBS/stylebanner.webp";
import toast from "react-hot-toast";
import axiosInstance from "@/app/redux/features/axiosInstance";
const Page = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        "/auth/forgot-password",
        { email },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Reset link sent!");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="w-full relative overflow-hidden group h-[200px]">
        <Image
          src={stylebanner}
          alt="Create your account"
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Lost your Password
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <Link
                href="/"
                className="hover:text-white transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <span className="text-white/70">/</span>
              <Link
                href="/pages/login"
                className="hover:text-white transition-colors duration-200 font-medium"
              >
                Login
              </Link>
              <span className="text-white/80">/</span>

              <span className="font-medium">Forget Password</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-300">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black">Forget Password</h2>
            <p className="text-gray-600">
              Please enter your email address and we will send you a link to
              reset your password.
            </p>
          </div>

          <form onSubmit={handleForgotPassword}>
            <div className="space-y-5">
              {/* Email */}
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
                    className="pl-3 pr-10 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="your@email.com"
                    required
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 green h-5 w-5" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full purple-btn flex justify-center items-center py-3 rounded-lg font-semibold text-white bg-purple-700 hover:bg-purple-800 transition ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading && (
                  <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                )}
                {loading ? "Submitting..." : "Submit"}
              </button>

              {/* Link */}
              <p className="text-sm text-gray-600 text-center mt-2">
                Create New Account{" "}
                <Link
                  href="/pages/signup"
                  className="green hover:underline font-medium"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;