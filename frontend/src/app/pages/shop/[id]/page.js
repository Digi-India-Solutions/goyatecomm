import Featureproduct from "@/app/components/FeatureProduct/Featureproduct";
import ProductDetails from "@/app/components/ProductsDetails/ProductsDetails";
import React from "react";

const page = () => {
  return (
    <>
      <div>
        <ProductDetails />
        <Featureproduct />
      </div>
    </>
  );
};

export default page;
