"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import blog1 from "../../Images/DowloadImage/blog-post-1.jpg";
import Link from "next/link";

// Simulate fetching blog posts from an API
const fetchBlogs = async (page) => {
  // You can replace this with an actual API call
  const blogs = [
    {
      title: "How grocers are apgkdfnjkg fjvdfjgkf vjfvjproaching delivery as the market evolves",
      date: "November 3, 2023",
      description: "Elinhawk breakfast i mbal delon mobilinstruksen...",
      Url: "/pages/blog/1",
    },
    {
      title: "The Friday Checkout: Food insecurity keeps retailers off balance",
      date: "November 3, 2023",
      description: "Filass tunulkissa och hentiv servicebeam...",
      Url: "/pages/blog/1",
    },
    {
      title: "Consumer want grocer to use AI to help them save money",
      date: "November 3, 2023",
      description: "I rel urban. Filass tunulkissa och hentiv...",
      Url: "/pages/blog/2",
    },
    {
      title:
        "Order up! How grocers are replicating the restaurant experience in retail",
      date: "November 3, 2023",
      description: "Elinhawk breakfast i mbal delon mobilinstruksen...",
      Url: "/pages/blog/2",
    },
    {
      title:
        "Order up! How grocers are replicating the restaurant experience in retail",
      date: "November 3, 2023",
      description: "Elinhawk breakfast i mbal delon mobilinstruksen...",
      Url: "/pages/blog/2",
    },
    {
      title:
        "Order up! How grocers are replicating the restaurant experience in retail",
      date: "November 3, 2023",
      description: "Elinhawk breakfast i mbal delon mobilinstruksen...",
      Url: "/pages/blog/2",
    },
    // Add more blogs here if needed
  ];

  // Pagination logic: return 2 blogs per page
  const pageSize = 2;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return blogs.slice(startIndex, endIndex);
};

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      const newBlogs = await fetchBlogs(currentPage);
      setBlogs(newBlogs);

      // Check if there are more blogs to load
      const moreBlogs = newBlogs.length === 2;
      setHasNextPage(moreBlogs);
    };
    loadBlogs();
  }, [currentPage]);

  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Blog Post */}
        <div className="md:col-span-8">
          {blogs?.length > 0 ? (
            blogs.map((blog, index) => (
              <Link key={index} href={blog.Url}>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                  <div className="relative h-100 w-full">
                    <Image
                      src={blog1} // Replace with your actual image path
                      alt="Featured blog"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block bg-purple text-white text-xs font-semibold rounded-full px-3 py-1 mb-3">
                      Uncategorized
                    </span>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {blog.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                      {blog.date} | Kitchen, themeWheel
                    </p>
                    <p className="text-gray-700 mb-4">{blog.description}</p>
                    <a
                      href="#"
                      className="inline-block text-white bg-purple hover:bg-purple/90 px-5 py-2 rounded-full font-semibold transition"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No blog posts available.</p>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="text-white bg-purple hover:bg-purple/90 px-4 py-2 rounded-lg disabled:bg-gray-400"
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={!hasNextPage}
              style={{
                backgroundColor: hasNextPage ? "var(--purple)" : "gray",
              }}
              className="text-white bg-purple hover:bg-purple/90 px-4 py-2 rounded-lg disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-4 space-y-8">
          {/* Blog Post List */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Blog Post List</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              {blogs.map((blog, index) => (
                <li key={index} className="border-b pb-2">
                  <a href="#" className="hover:green font-medium">
                    {blog.title}
                  </a>
                  <div className="text-xs text-gray-500">{blog.date}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Widget */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Social Media Widget</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Facebook
              </a>
              <a
                href="#"
                className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Twitter
              </a>
              <a
                href="#"
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg"
              >
                Instagram
              </a>
              <a
                href="#"
                className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
