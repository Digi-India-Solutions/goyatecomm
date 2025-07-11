import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideSearch } from "lucide-react";
import axiosInstance, { serverUrl } from "@/app/redux/features/axiosInstance";
import Image from "next/image";
import image1 from "../../Images/DBS/1.jpg";
import Link from "next/link";
import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";

export default function ProductSearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch data on debounced term
  useEffect(() => {
    if (debouncedTerm.trim() === "") {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/product/search-products?search=${debouncedTerm}`
        );
        setResults(response.data.products || []);
      } catch (err) {
        console.error("Error fetching search results", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedTerm]);

  const handleResultClick = () => {
    setSearchTerm(""); // Clears input
    setDebouncedTerm(""); // Prevents re-fetch
    setResults([]); // Clears result dropdown
  };

  return (
    <motion.div
      className="flex-1 max-w-2xl mx-2 w-full relative"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
        <input
          type="text"
          placeholder="Search for products, categories or authors..."
          className="w-full px-4 py-3 outline-none text-sm bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="px-4 py-2 text-gray-700">
          <LucideSearch className="w-5 h-5" />
        </button>
      </div>

      {/* Search results dropdown */}
      {searchTerm && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-gray-500 text-sm">Loading...</p>
          ) : results?.length > 0 ? (
            results.map((product) => (
              <div key={product._id} onClick={handleResultClick}>
                <Link href={`/pages/shop/${product._id}`}>
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer">
                    <Image
                      src={product?.images[0] ? `${serverUrl}/public/image/${product?.images[0]}` :  CallBackImg}
                      // src={image1}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded"
                      width={10}
                      height={10}
                    />
                    <div className="text-sm">
                      <p className="font-medium line-clamp-1">
                        {product.title}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {product.category?.SubCategoryName || "Unknown"} ·{" "}
                        {product.author || "Unknown Author"}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="p-4 text-gray-500 text-sm">No results found.</p>
          )}
        </div>
      )}
    </motion.div>
  );
}
