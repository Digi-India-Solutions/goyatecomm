import React from "react";
import Image from "next/image";
import Image1 from "../../Images/DBS/stylebanner.webp";
import BestSeller from "@/app/components/BestSeller/BestSeller";
const page = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      <div className="relative rounded-xl overflow-hidden group">
        {/* Background Image */}
        <Image
          src={Image1}
          alt="Supermarket banner"
          width={1200}
          height={400}
          className="w-full h-[200px] object-fill md:h-[300px] md:object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h2 className="text-white text-2xl md:text-4xl font-bold">
            Best Selling Products
          </h2>
        </div>
      </div>
      <BestSeller productlength={10000} btnlength={10000} />
    </div>
  );
};

export default page;
