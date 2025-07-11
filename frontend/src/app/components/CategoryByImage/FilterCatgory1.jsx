"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { motion } from "framer-motion"; // Importing the necessary hooks
import { useDispatch, useSelector } from "react-redux";
import { fetchBannerByCategory } from "@/app/redux/features/BannerByCategory/BannerByCategory";
import { serverUrl } from "@/app/redux/features/axiosInstance";

const FilterCatgory1 = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.bannerByCategory
  );

  useEffect(() => {
    dispatch(fetchBannerByCategory());
  }, [dispatch]);

  const level1Categories = data.filter((item) => item.level === 1);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
      {level1Categories?.map((category) => (
        <Link
          key={category._id}
                    href={`/pages/shop/productBysubcategory/${category.category?._id}`}

          className="block group"
        >
          {/* Using motion.div to animate the element when in view */}
          <motion.div
            className="relative overflow-hidden rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 50 }} // Initial hidden state
            whileInView={{ opacity: 1, y: 0 }} // State when in view
            viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% of the element is in view
            transition={{ duration: 0.6 }} // Animation duration
          >
            <Image
              src={`${serverUrl}/public/image/${category.levelImage}`}
              alt={category?.category?.SubCategoryName}
              width={400}
              height={250}
              className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* <div className="absolute bottom-0 w-full flex items-center justify-center pb-2">
              <button style={{backgroundColor:"#4cb051"}} className="hover:bg-purple-800 text-white font-medium px-4 py-2 border border-white rounded-full inline-flex items-center gap-2 transition cursor-pointer">
                Shop Now <MoveRight size={14} />
              </button>
            </div> */}
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

export default FilterCatgory1;
