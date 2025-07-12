"use client";
import React, { useEffect, useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import payment from "../../Images/DowloadImage/paymentsecure.avif";
import Image from "next/image";
import Link from "next/link";
import logo from "../../Images/DowloadImage/logo.png";
import { fetchCategories } from "@/app/redux/features/getAllCategory/categorySlice";
import { verifyUser } from "@/app/redux/features/auth/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "@/app/redux/features/axiosInstance";

const Footer = () => {
  const user = useSelector((state) => state.login.user);

  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);
  const [product, setProduct] = useState([]);

  const fetchNewArrivals = async () => {
    try {
      const response = await axiosInstance.get(
        "/product/get-best-selling-books"
      );
      setProduct(response.data.products || []);
    } catch (err) {
      toast.error("Failed to load New Arrival product. Please try again later.");
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(verifyUser());
    fetchNewArrivals()
  }, [dispatch]);

  return (
    <footer className="bg-gray-100 text-black text-sm">
      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:flex md:justify-between md:items-center border-b border-gray-400">
        <div className="mb-6 md:mb-0">
          <h2 className="text-md md:text-lg font-semibold">
            Join our newsletter for latest deals & updates
          </h2>
          <p className="text-gray-600 max-w-md">
            Register now to get latest updates on promotions & coupons. Don’t
            worry, we not spam!
          </p>
        </div>
        <form className="flex w-full justify-end md:w-96">
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full px-4 py-3 rounded-l-md bg-white border border-gray-300 focus:outline-purple-600"
          />
          <button
            className=" text-white px-6 rounded-r-md font-semibold"
            style={{ backgroundColor: "var(--purple)" }}
          >
            SEND
          </button>
        </form>
      </div>

      {/* Links section */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Help */}
        <div>
          <Link href={"/"}>
            <Image src={logo} alt="logo" className="w-auto h-20 md:m-auto" />
          </Link>
          <div className="my-2 flex items-center gap-4">
            <Phone style={{ color: "var(--purple)" }} />{" "}
            <div className="flex flex-col items-left text-sm">
              <p className=" text-gray-600">Monday-Saturday: 9:30 am – 11:00 pm</p>
              {/* <p className="text-lg font-bold mt-1">+91 8283863884</p> */}
            </div>
          </div>
          <div className="mb-2 flex items-center gap-4">
            <Mail style={{ color: "var(--purple)" }} />{" "}
            <div className="flex flex-col items-left">
              <p className=" text-gray-600">tradinggoyat@gmail.com</p>
              <p className=" text-gray-600">tradinggoyat@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Make Money */}
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-gray-600">
            {categories.slice(0, 5).map((category, id) => (
              <li className="hover:underline hover:text-black" key={id}>
                <Link href={`/pages/categories/${category._id}`}>
                  {category.Parent_name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help You */}
        <div>
          <h3 className="font-semibold mb-3">Let Us Help You</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="hover:underline hover:text-black">
              {" "}
              {/* <Link href="/pages/shop">Shop Books</Link> */}
            </li>
            <li className="hover:underline hover:text-black">
              {" "}
              {/* <Link href="/pages/featurebook">Feature Books</Link> */}
            </li>
            <li className="hover:underline hover:text-black">
              {" "}
              <Link href="/pages/bestSellerbook">Best Sellers</Link>
            </li>
            {/* <li className="hover:underline hover:text-black">
              {" "}
              <Link href="/pages/blog">Blog</Link>
            </li> */}
            <li className="hover:underline hover:text-black">
              {" "}
              <Link href="/pages/contact">Contact US</Link>
            </li>
          </ul>
        </div>

        {/* Know Us */}
        <div>
          <h3 className="font-semibold mb-3">Best Selling Items</h3>
          <ul className="space-y-2 text-gray-600">
            {
              product?.slice(0, 5)?.map((pro, id) => (
                <li className="hover:underline hover:text-black line-clamp-1" key={id}>
                  <Link href={`/pages/shop/${pro._id}`}>
                    {pro.title}
                  </Link>
                </li>
              ))
            }

          </ul>
        </div>

        {/* Download + Social */}
        <div>
          <h3 className="font-semibold mb-3">Follow us on social media</h3>
          <div className="flex space-x-3">
            <Link
              href="#"
              target="_blank"
              className="p-2 bg-white text-blue-700 rounded shadow"
            >
              <Facebook />
            </Link>
            <Link
              href="#"
              target="_blank"
              className="p-2 bg-white text-blue-800 rounded shadow"
            >
              <Twitter />
            </Link>
            <Link
              href="#"
              target="_blank"
              className="p-2 bg-white text-red-600 rounded shadow"
            >
              <Instagram />
            </Link>
            <Link
              href="#"
              target="_blank"
              className="p-2 bg-white text-blue-500 rounded shadow"
            >
              <Linkedin />
            </Link>
          </div>

          {!user && !user?.email ? (
            <div className="mt-8 flex justify-around align-baseline">
              <Link href={"/pages/login"}>
                <button className="purple-btn">LogIn</button>
              </Link>
              <Link href={"/pages/signup"}>
                <button className="black-btn">SignUP</button>
              </Link>
            </div>
          ) : (
            <div className="mt-8 flex justify-around align-baseline">
              <Link href={"/pages/userprofile"}>
                <button className="purple-btn">Profile</button>
              </Link>
              <Link href={"/pages/signup"}>
                <button className="black-btn">Orders</button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto text-center text-sm text-gray-600 leading-relaxed">
        <i>
        <p>
          Goyat Trading is an online grocery delivery platform similar to <b> Swiggy and Zomato </b> —
          built to deliver daily essentials to your doorstep quickly and affordably.
        </p>
        <p className="mb-3">
          Enjoy a seamless shopping experience with real-time inventory, instant checkout, and express delivery services.
        </p>
        </i>
      </div>

      {/* Bottom Bar */}
      <div className="border-t text-center text-sm text-gray-400 py-4 px-4 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        <div className="flex flex-col">
          <p className="m-0 text-gray-600">
            Copyright 2025 © GOYAT TRADING. All rights reserved. Powered by{" "}
            <Link
              href="https://www.digiindiasolutions.com/"
              target="_blank"
              className="text-indigo-600 font-bold hover:text-indigo-800 underline"
            >
              <span>DIGI INDIA SOLUTIONS</span>.
            </Link>
          </p>
          <Image src={payment} className="h-25 w-70 m-auto md:m-0" alt="Visa" />
        </div>
        <div className="flex space-x-3 mt-2 md:mt-0">
          <Link
            href="/pages/privacy-policy"
            className="text-gray-600 hover:text-gray-700"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-600">|</span>
          <Link
            href="/pages/terms-and-conditions"
            className="text-gray-600 hover:text-gray-700"
          >
            Terms of Use
          </Link>
          <span className="text-gray-600">|</span>
          <Link href="#" className="text-gray-600 hover:text-gray-700">
            Order Tracking
          </Link>
          <span className="text-gray-600">|</span>
          <Link
            href="/pages/return-refund-policy"
            className="text-gray-600 hover:text-gray-700"
          >
            Return & Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
