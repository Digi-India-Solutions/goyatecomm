import Featureproduct from "@/app/components/FeatureProduct/Featureproduct";
import ShopBanner from "@/app/components/Shop/ShopBanner";
import React from "react";

const page = () => {
  return (
    <>
      <ShopBanner />
      <Featureproduct productlength={10000} btnlength={10000} />
      
    </>
  );
};

export default page;
