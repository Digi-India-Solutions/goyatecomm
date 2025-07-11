"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Star } from "lucide-react";
import Image from "next/image";
import testi1 from "../../Images/DowloadImage/Testi1.jpg";
import testi2 from "../../Images/DowloadImage/Testi2.jpg";
import testi3 from "../../Images/DowloadImage/testi3.jpg";
import testi4 from "../../Images/DowloadImage/testi4.jpg";
import testi5 from "../../Images/DowloadImage/testi5.jpg";
import testi6 from "../../Images/DowloadImage/testi6.jpg";
import testi7 from "../../Images/DowloadImage/testi7.jpg";
import testi8 from "../../Images/DowloadImage/Testi1.jpg";
import testi9 from "../../Images/DowloadImage/testi9.jpg";
import testi10 from "../../Images/DowloadImage/testi10.jpg";
const Testimonial = () => {
  const testimonials = [
  {
    name: "Anjali Sharma",
    rating: 4.5,
    count: 58,
    message:
      "Fresh vegetables and fruits delivered right to my doorstep. Great quality and service!",
    image: testi1,
  },
  {
    name: "Priya Verma",
    rating: 4,
    count: 46,
    message:
      "I always find the best deals on daily essentials. Highly recommend this grocery store!",
    image: testi2,
  },
  {
    name: "Rani Mehra",
    rating: 4.2,
    count: 51,
    message:
      "Groceries were well-packed and super fresh. Makes weekly shopping so easy.",
    image: testi3,
  },
  {
    name: "Sunita Rani",
    rating: 3.8,
    count: 39,
    message:
      "Delivery took a bit longer than expected, but everything was fresh and neatly packed.",
    image: testi4,
  },
  {
    name: "Karan Patel",
    rating: 4,
    count: 44,
    message:
      "Great variety of kitchen staples and snacks. My go-to for monthly grocery shopping.",
    image: testi5,
  },
  {
    name: "Meena Joshi",
    rating: 4.7,
    count: 62,
    message:
      "Loved the quality of dairy and bakery items. Fast delivery and well-maintained packaging.",
    image: testi6,
  },
  {
    name: "Nikhil Das",
    rating: 3.9,
    count: 41,
    message:
      "Good stock of organic items and health foods. Would love to see more local brands.",
    image: testi7,
  },
  {
    name: "Anjali Gupta",
    rating: 4.6,
    count: 59,
    message:
      "Found all the grocery items I needed in one place. Amazing discounts on combos too!",
    image: testi8,
  },
  {
    name: "Rajesh Yadav",
    rating: 4,
    count: 50,
    message:
      "Customer support helped me with a refund issue smoothly. Very professional team.",
    image: testi9,
  },
  {
    name: "Sneha Iyer",
    rating: 3.5,
    count: 36,
    message:
      "Overall good experience, but would appreciate more delivery slots for remote areas.",
    image: testi10,
  },
];


  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Our Customers</h2>
        <p className="text-sm text-gray-500">
          Honest feedback from our valued customers.
        </p>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={5}
        navigation
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop
      >
        {testimonials.map((t, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow hover:shadow-md transition text-sm h-full">
              <Image
                src={t.image}
                alt={t.name}
                className="w-12 h-12 mx-auto rounded-full object-cover mb-2"
              />
              <h4 className="font-semibold text-gray-800">{t.name}</h4>
              <div className="flex justify-center items-center gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.round(t.rating) ? "#facc15" : "none"}
                    stroke="#facc15"
                  />
                ))}
                <span className="text-xs text-gray-600 ml-1">{t.count}</span>
              </div>

              <hr className="my-2" />
              <p className="text-gray-600 text-xs">{t.message}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonial;
