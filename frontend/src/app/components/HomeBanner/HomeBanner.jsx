"use client";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanners } from "@/app/redux/features/banners/bannerSlice";
import { serverUrl } from "@/app/redux/features/axiosInstance";

const HomeBanner = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.banners);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg shadow-md flex items-center justify-center">
        <div className="w-3/4 h-1/2 bg-gray-300 rounded-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">Error loading banners</div>
    );
  }

  return (
    <section className="w-full md:w-[78%] ml-auto py-6 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            loop
            className="rounded-2xl overflow-hidden"
          >
            {items
              ?.filter((item) => item.isActive === true)
              .map((slide) => (
                <SwiperSlide key={slide.id}>
                  <motion.div
                    className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[450px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    <Image
                      src={`${serverUrl}/public/image/${slide.bannerImage}`}
                      alt={"banners"}
                      fill
                      className="object-fill"
                      priority
                    />
                  </motion.div>
                </SwiperSlide>
              ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeBanner;
