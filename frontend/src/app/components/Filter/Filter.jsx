"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Disclosure } from "@headlessui/react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const AdvancedFilter = ({ categoryOptions = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultMin = 0;
  const defaultMax = 10000;

  // Get initial values from URL
  const initialCategories = searchParams.getAll("mainCategory");
  const initialMinPrice = Number(searchParams.get("minPrice")) || defaultMin;
  const initialMaxPrice = Number(searchParams.get("maxPrice")) || defaultMax;

  const [selectedCategories, setSelectedCategories] = useState(initialCategories);
  const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);

  // ✅ Push updated query to URL
 const updateURLParams = (categories, price) => {
  const query = new URLSearchParams();

  if (categories?.length > 0) {
    categories.forEach((cat) => query.append("mainCategory", cat));
  }

  // ✅ Always send both prices
  query.set("minPrice", price[0]);
  query.set("maxPrice", price[1]);

  query.set("page", 1); // optional: reset pagination

  router.push(`?${query.toString()}`);
};

  // ✅ Handle Category Change
  const onCategoryChange = (category) => {
    let updated = [...selectedCategories];

    if (updated.includes(category)) {
      updated = updated.filter((c) => c !== category);
    } else {
      updated.push(category);
    }

    setSelectedCategories(updated);
    updateURLParams(updated, priceRange);
  };

  // ✅ Handle Price Change
  const onPriceChange = (range) => {
    setPriceRange(range);
    updateURLParams(selectedCategories, range);
  };

  // ✅ Sync with URL on mount if values change externally
  useEffect(() => {
    const newMin = Number(searchParams.get("minPrice")) || defaultMin;
    const newMax = Number(searchParams.get("maxPrice")) || defaultMax;
    setPriceRange([newMin, newMax]);

    const newCategories = searchParams.getAll("mainCategory");
    setSelectedCategories(newCategories);
  }, [searchParams]);

  return (
    <div className="w-full lg:w-64 bg-white shadow rounded-lg p-4 space-y-6 z-20 max-h-[90vh] overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800">Filters</h2>

      {/* Price Range */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <div>
            <Disclosure.Button className="flex justify-between w-full text-sm font-medium text-gray-700 mt-4">
              Price Range {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Disclosure.Button>
            <Disclosure.Panel className="mt-4 space-y-2">
              <Slider
                range
                min={defaultMin}
                max={defaultMax}
                value={priceRange}
                onChange={onPriceChange}
                trackStyle={[{ backgroundColor: "#4f46e5" }]}
                handleStyle={[
                  { borderColor: "#4f46e5", backgroundColor: "#fff" },
                  { borderColor: "#4f46e5", backgroundColor: "#fff" },
                ]}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>

      {/* Category */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <div>
            {categoryOptions?.length > 0 && (
              <Disclosure.Button className="flex justify-between w-full text-sm font-medium text-gray-700">
                Category {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Disclosure.Button>
            )}
            <Disclosure.Panel className="mt-2 space-y-2">
              {categoryOptions?.map((category, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => onCategoryChange(category)}
                    className="form-checkbox text-indigo-600"
                  />
                  <span className="text-sm text-gray-600">{category}</span>
                </label>
              ))}
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </div>
  );
};

export default AdvancedFilter;


// import { Disclosure } from "@headlessui/react";
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";
// import { ChevronUp, ChevronDown } from "lucide-react";

// const AdvancedFilter = ({
//   selectedCategories,
//   onCategoryChange,
//   priceRange,
//   setPriceRange,
//   categoryOptions = [],
// }) => {
//   //   const categoryOptions = ["T-Shirts", "Shirts", "Jeans"];
//   const minPrice = 0;
//   const maxPrice = 2000;

//   return (
//     <div className="w-full lg:w-64 bg-white shadow rounded-lg p-4 space-y-6 z-20 max-h-[90vh] overflow-y-auto">
//       <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
//  {/* Price Range Section */}
//       <Disclosure defaultOpen>
//         {({ open }) => (
//           <div>
//             <Disclosure.Button className="flex justify-between w-full text-sm font-medium text-gray-700 mt-4">
//               Price Range{" "}
//               {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//             </Disclosure.Button>
//             <Disclosure.Panel className="mt-4 space-y-2">
//               <Slider
//                 range
//                 min={minPrice}
//                 max={maxPrice}
//                 value={priceRange}
//                 onChange={(range) => setPriceRange(range)}
//                 trackStyle={[{ backgroundColor: "#4f46e5" }]}
//                 handleStyle={[
//                   { borderColor: "#4f46e5", backgroundColor: "#fff" },
//                   { borderColor: "#4f46e5", backgroundColor: "#fff" },
//                 ]}
//               />
//               <div className="flex justify-between text-sm text-gray-600 mt-1">
//                 <span>₹{priceRange[0]}</span>
//                 <span>₹{priceRange[1]}</span>
//               </div>
//             </Disclosure.Panel>
//           </div>
//         )}
//       </Disclosure>
//       {/* Category Section */}
//       <Disclosure defaultOpen>
//         {({ open }) => (
//           <div>
//             {categoryOptions?.length > 0 && (
//               <Disclosure.Button className="flex justify-between w-full text-sm font-medium text-gray-700">
//                 Category{" "}
//                 {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </Disclosure.Button>
//             )}

//             <Disclosure.Panel className="mt-2 space-y-2">
//               {categoryOptions?.map((category,i) => (
//                 <label key={i} className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedCategories.includes(category)}
//                     onChange={() => onCategoryChange(category)}
//                     className="form-checkbox text-indigo-600"
//                   />
//                   <span className="text-sm text-gray-600">{category}</span>
//                 </label>
//               ))}
//             </Disclosure.Panel>
//           </div>
//         )}
//       </Disclosure>

     
// {/* 
//       <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 rounded-md mt-4">
//         Apply Filters
//       </button> */}
//     </div>
//   );
// };

// export default AdvancedFilter;
