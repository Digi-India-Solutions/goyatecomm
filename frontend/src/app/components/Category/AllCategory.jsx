"use client";
import { fetchCategories } from "@/app/redux/features/getAllCategory/categorySlice";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import picture from "../../Images/DowloadImage/kurkure.avif";
import banner from "../../Images/DBS/banner.JPG";
import Image from "next/image";
import ShopBanner from "../Shop/ShopBanner";
import { serverUrl } from "@/app/redux/features/axiosInstance";

const AllCategory = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  // Helper function to generate light pastel color
  const getRandomLightColor = () => {
    const hue = Math.floor(Math.random() * 360); // hue between 0-360
    const pastel = hsl(${hue}, 100%, 90%); // pastel background using HSL
    return pastel;
  };

  // UseMemo to generate stable colors once when categories load
  const categoryColors = useMemo(() => {
    const colorMap = {};
    categories.forEach((cat) => {
      colorMap[cat._id] = getRandomLightColor();
    });
    return colorMap;
  }, [categories]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h2 className="text-4xl font-bold mb-4 text-center green">
          All Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg h-20 animate-pulse bg-purple-100"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        Error loading categories
      </div>
    );
  }

  console.log(
    "Categories:",
    categories.filter((cat) => cat.mainCategoryImage)
  );

  return (
    <>
      <div>
        {/* <Image src={banner} alt="banner-image" /> */}
        <ShopBanner />
      </div>
      <div className="max-w-7xl mx-auto py-5 px-4">
        <h2 className="text-4xl font-bold mb-4 text-center green">
          All Categories
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {categories.map((category) => (
            <Link
              href={/pages/categories/${category._id}}
              key={category._id}
              className="flex justify-center items-center p-0 m-0"
            >
              <div className="w-[150px] h-[150px] bg-[rgb(236,244,254,0.5)] rounded-lg border border-purple-200 hover:shadow-md transition duration-300 flex flex-col items-center justify-center overflow-hidden">
                <img
                  className="w-[100px] h-[100px] object-cover"
                  src={
                    category?.mainCategoryImage
                      ? ${serverUrl}/public/image/${category.mainCategoryImage}
                      : picture
                  }
                  alt={category?.Parent_name || "Category"}
                  width={100}
                  height={100}
                />
                <p className="mt-1 text-center font-medium text-xs text-gray-700 break-words">
                  {category?.Parent_name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllCategory;