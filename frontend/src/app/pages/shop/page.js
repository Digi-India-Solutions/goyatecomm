import Shop from "@/app/components/Shop/Shop";
import React, { Suspense } from "react";

const page = () => {
  return (
    <>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Shop />
        </Suspense>
      </div>
    </>
  );
};

export default page;
