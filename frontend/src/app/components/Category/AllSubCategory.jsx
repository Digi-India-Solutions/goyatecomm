"use client";
import { serverUrl } from "@/app/redux/features/axiosInstance";
import { fetchSubCategories } from "@/app/redux/features/getAllCategory/categorySlice";
// import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";

export default function AllSubCategory() {
  const dispatch = useDispatch();
  const param = useParams();
  const categoryId = param.id;
  const { subCategories, loading, error } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(fetchSubCategories(categoryId));
  }, [dispatch, categoryId]);

  console.log("SubCategories:", categoryId);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse space-y-2 rounded-lg border border-gray-200 p-4 shadow"
          >
            <div className="h-32 bg-gray-300 rounded-md"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        Error loading SubCategories
      </div>
    );
  }

  console.log("SubCategories:", subCategories);

  return (
    <section className="w-full py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by {subCategories[0]?.Parent_name?.Parent_name || "Sub Category"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of groceries across different subcategories
            — from fresh produce to daily essentials!
          </p>
        </div>

        {/* Categories Grid */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {subCategories.map((category) => (
            <Link
              key={category._id}
              href={`/pages/shop/productBysubcategory/${category._id}`}
              passHref
              className="group block green rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
       
              <div className="relative w-full h-40 sm:h-56 lg:h-55">
                <Image
                  src={
                    category.categoryImage
                      ? `${serverUrl}/public/image/${category.categoryImage}`
                      : CallBackImg
                  }
                  alt={category.SubCategoryName}
                  fill
                  className="object-fill group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 bg-green-500 bg-opacity-80 rounded-b-lg">
                <h3 className="text-sm md:text-md font-semibold text-white text-center">
                  {category.SubCategoryName}
                </h3>
              </div>
            </Link>
          ))}
        </div> */}
{
  subCategories.length === 0 && (
    <div className="text-center py-6 text-gray-500">
      No subcategories available for this category.
    </div>
  )
}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {subCategories.map((category) => (
            <Link
              href={`/pages/shop/productBysubcategory/${category._id}`}
              key={category._id}
              className="flex justify-center items-center p-0 m-0"
            >
              <div className="w-[150px] h-[150px] bg-[rgb(236,244,254,0.5)] rounded-lg border border-purple-200 hover:shadow-md transition duration-300 flex flex-col items-center justify-center overflow-hidden">
                <img
                  className="w-[100px] h-[100px] object-cover"
                  src={
                    category.categoryImage
                      ? `${serverUrl}/public/image/${category.categoryImage}`
                      : CallBackImg
                  }
                  alt={category.SubCategoryName}
                  width={100}
                  height={100}
                />
                <p className="mt-1 text-center font-medium text-xs text-gray-700 break-words">
                  {category.SubCategoryName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
