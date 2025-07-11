"use client";
import React from "react";
import stylebanner from "../../Images/DBS/stylebanner.webp";
import Image from "next/image";
const StyleBanner1 = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="rounded-2xl overflow-hidden shadow-lg group">
        {/* Background Image */}
        <Image
          src={stylebanner}
          alt="Supermarket banner"
          width={1200}
          height={400}
          className="w-full h-[230px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  );
};

export default StyleBanner1;
