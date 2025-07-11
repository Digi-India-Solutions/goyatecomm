"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { fetchBannerByCategory } from "@/app/redux/features/BannerByCategory/BannerByCategory";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "@/app/redux/features/axiosInstance";

const FilterCatgory3 = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.bannerByCategory
  );

  useEffect(() => {
    dispatch(fetchBannerByCategory());
  }, [dispatch]);

  const level1Categories = data.filter((item) => item.level === 3);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {level1Categories?.map((category) => (
        <Link
          key={category._id}
          href={`/pages/shop/productBysubcategory/${category.category?._id}`}
          className="block group"
        >
          <div className="relative overflow-hidden rounded-xl shadow-lg">
            <Image
              src={`${serverUrl}/public/image/${category.levelImage}`}
              alt={category?.category?.SubCategoryName}
              width={400}
              height={250}
              className="w-full h-[200px] md:h-[250px] object-fill md:object-fill transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 w-full flex items-center justify-center pb-2">
              <button
                className=" hover:bg-green-800 text-white bg-[#4cb051] font-medium px-4 py-2 border border-white rounded-full inline-flex items-center gap-2 transition cursor-pointer"
              >
                Shop Now <MoveRight size={14} />
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FilterCatgory3;
