"use client";
import { use, useEffect, useState } from "react";
import stylebanner from "../../Images/DBS/stylebanner.webp";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { signupUser } from "@/app/redux/features/auth/signupSlice";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, success } = useSelector((state) => state.auth);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    const userData = {
      fullName,
      email,
      password,
    };

    try {
      dispatch(signupUser(userData)).unwrap();
      setfullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error || "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (success) {
      toast.success("Account created successfully!");
      setTimeout(() => {
        router.push("/pages/login");
      }, 2000);
    } else if (error) {
      toast.error(error);
    }
  }, [success, error]);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="w-full relative overflow-hidden group h-[250px]">
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
              Create Account
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <Link
                href="/"
                className="hover:text-white transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <span className="text-white/70">/</span>
              <span className="font-medium">Signup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-reverse md:grid-cols-2 gap-8 items-start">
          {/* Right Side: Benefits */}
          <div
            className="rounded-xl shadow-lg p-8 border border-gray-300 order-2 md:order-1"
            style={{
              backgroundImage:
                "linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%)",
            }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black">
                Why Create an Account?
              </h2>
              <p className="text-gray-600 mt-1">
                Unlock the best of our services and benefits.
              </p>
            </div>

            <div className="space-y-4">
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
              ].map((item, index) => (
                <div className="flex items-start" key={index}>
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="green text-xs">✓</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-black">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/pages/login"
              className="mt-4 text-center block w-full purple-btn"
            >
              <span className="font-medium">Already have an account</span>: Sign
              In
            </Link>
            <div className="mt-3 p-4 bg-white rounded-lg border border-gray-300">
              <p className="text-sm text-gray-600 text-center">
                <span className="font-medium">Secure Shopping Guarantee</span>:
                Your data is encrypted and secure with us.
              </p>
            </div>
          </div>
          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-300 order-1 md:order-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black">Sign Up</h2>
              <p className="text-gray-600 mt-1">
                Create an account to enjoy all the benefits
              </p>
            </div>

            <form onSubmit={handleSignup}>
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      value={fullName}
                      onChange={(e) => setfullName(e.target.value)}
                      className="pl-3 pr-10 py-3 w-full border border-gray-300 rounded-lg duration-200"
                      placeholder="John Doe"
                      required
                    />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 green h-5 w-5" />
                  </div>
                </div>

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
                      className="pl-3 pr-10 py-3 w-full border border-gray-300 rounded-lg duration-200"
                      placeholder="your@email.com"
                      required
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 green h-5 w-5" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-3 pr-10 py-3 w-full border border-gray-300 rounded-lg duration-200"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 green hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-3 pr-10 py-3 w-full border border-gray-300 rounded-lg duration-200"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 green hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full black-btn"
                >
                  {loading ? (
                    <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  ) : null}
                  {loading ? "Creating account..." : "Sign Up"}
                </button>

                <p className="text-sm text-gray-600 text-center mt-2">
                  Already have an account?{" "}
                  <Link
                    href="/pages/login"
                    className="green hover:underline font-medium"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
