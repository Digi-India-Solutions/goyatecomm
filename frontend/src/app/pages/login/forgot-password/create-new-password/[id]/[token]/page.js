"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import stylebanner from "../../../../../../Images/DBS/stylebanner.webp";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/app/redux/features/axiosInstance";

const Page = () => {
  const { id, token } = useParams();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        `/auth/reset-password/${id}/${token}`,
        { password: newPassword }
      );

      toast.success("Password reset successfully!");
      setTimeout(() => {
        router.push("/pages/login");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="w-full relative overflow-hidden group h-[200px]">
        <Image
          src={stylebanner}
          alt="Reset your password"
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Reset Password
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <Link
                href="/"
                className="hover:text-white transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <span className="text-white/70">/</span>
              <span className="font-medium">Reset Password</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-300">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black">
              Reset Your Password
            </h2>
            <p className="text-gray-600">
              Enter your new password and confirm it to reset your account
              password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-3 pr-10 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter new password"
                  required
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 green h-5 w-5" />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-3 pr-10 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Confirm new password"
                  required
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 green h-5 w-5" />
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
              {loading ? "Submitting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
