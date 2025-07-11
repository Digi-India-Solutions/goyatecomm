"use client";
import React from 'react';
import Image from 'next/image';
import blog1 from '../../../Images/DowloadImage/blog-post-1.jpg';
import Link from 'next/link';

// Mock recent blog data
const recentBlogs = [
  { title: "How grocers are approaching delivery", date: "Nov 3, 2023" },
  { title: "The Friday Checkout: Food insecurity", date: "Nov 3, 2023" },
  { title: "Consumer want grocer to use AI", date: "Nov 3, 2023" },
];

const page = () => {
  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Blog Detail Content */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="relative w-full h-96">
              <Image
                src={blog1}
                alt="Blog Detail"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <span className="inline-block bg-purple text-white text-xs font-semibold rounded-full px-3 py-1 mb-3">
                Uncategorized
              </span>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                How grocers are approaching delivery as the market evolves
              </h1>
              <p className="text-sm text-gray-500 mb-4">
                November 3, 2023 | Kitchen, themeWheel
              </p>
              <div className="text-gray-700 space-y-4 leading-relaxed">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique, eros nec cursus tempus, nibh sapien pretium tellus, ac pulvinar lorem lacus sit amet nulla.
                </p>
                <p>
                  Quisque vel ipsum a diam fringilla consequat. Aliquam erat volutpat. Aenean faucibus eros vel lectus feugiat, et scelerisque quam convallis.
                </p>
                <p>
                  Nunc nec viverra magna. Sed sodales, libero vel sollicitudin laoreet, felis mi luctus nisi, a finibus lorem metus id libero.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-4 space-y-8">
          {/* Recent Posts */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Posts</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              {recentBlogs.map((blog, index) => (
                <li key={index} className="border-b pb-2">
                  <Link href="#">
                    <span className="hover:green font-medium">{blog.title}</span>
                  </Link>
                  <div className="text-xs text-gray-500">{blog.date}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Widget */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Facebook</a>
              <a href="#" className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">Twitter</a>
              <a href="#" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg">Instagram</a>
              <a href="#" className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
