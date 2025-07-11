import React from "react";
import Image from "next/image";
import Image1 from "../../Images/DBS/BANNER3.png";
const ShopBanner = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className=" rounded-xl overflow-hidden group">
          {/* Background Image */}
          <Image
            src={Image1}
            alt="Supermarket banner"
            width={1200}
            height={400}
            className="w-full h-[200px] object-fill md:h-[300px] md:object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
    </>
  );
};

export default ShopBanner;
