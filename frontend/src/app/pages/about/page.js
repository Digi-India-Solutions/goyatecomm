import React from "react";
import banner from "../../Images/DowloadImage/about.jpg";
import aboutimage1 from "../../Images/DowloadImage/about-1.jpg";
import aboutimage2 from "../../Images/DowloadImage/about-2.jpg";
import aboutimage3 from "../../Images/DowloadImage/grocerry-image.png";
import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-gray-700 font-sans">
      {/* Banner Section */}
      <div className="relative overflow-hidden rounded-xl shadow-2xl group">
        <Image
          src={banner}
          alt="Supermarket banner"
          width={1200}
          height={400}
          className="w-full h-[300px] md:h-[450px] object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6">
          <div className="text-white space-y-4 max-w-3xl">
            <h3 className="text-xl md:text-2xl font-medium tracking-wide">
              Welcome to Goyat Trading
            </h3>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              India's Trusted Online Grocery Marketplace
            </h1>
            <p className="text-md md:text-lg font-light text-gray-200">
              Your daily needs — now just a click away. Freshness, speed, and savings delivered to your doorstep.
            </p>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <section className="mt-16 space-y-2 text-lg leading-relaxed md:px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-6">
          About Goyat Trading
        </h2>
        <hr />
        <p>
          Goyat Trading is a leading online grocery eCommerce platform that brings convenience, variety, and affordability to your daily shopping experience. From fresh fruits and vegetables to personal care, packaged foods, dairy, and household essentials — we have everything you need under one digital roof.
        </p>
        <p>
          Founded with the vision of transforming how India shops for groceries, Goyat Trading combines modern technology with strong logistics to create a seamless, reliable, and fast grocery shopping experience for every home.
        </p>
        <p>
          We work directly with farmers, suppliers, and trusted brands to ensure that every item you receive is of top-notch quality — fresh, hygienic, and affordably priced.
        </p>
        <p>
          Our platform is powered by a robust inventory system, real-time stock updates, and intelligent recommendations tailored to your needs.
        </p>
        <p>
          Whether you're buying weekly essentials or stocking up for the month, Goyat Trading offers flexible delivery slots, secure payments, and easy returns — all backed by dedicated customer support.
        </p>
        <p>
          With growing demand across cities and towns, we are expanding rapidly, building fulfillment centers, last-mile delivery teams, and tech infrastructure that supports high-volume operations with speed and accuracy.
        </p>
      </section>

      {/* Vision Section */}
      <section className="mt-16 text-center px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
          Our Vision
        </h2>
        <hr />
        <p className="text-lg text-gray-600 max-w-5xl mx-auto">
          Our vision is to be India’s most customer-centric and trusted online grocery destination — offering fresh, affordable, and reliable products to every household, every day.
        </p>
        <p className="text-lg text-gray-600 max-w-5xl mx-auto mt-4">
          We aim to simplify lives through innovation, technology, and efficient delivery — building a platform where grocery shopping becomes effortless and enjoyable.
        </p>
      </section>

      {/* Image Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {[aboutimage1, aboutimage2].map((img, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            <Image
              src={img}
              alt={`About image ${idx + 1}`}
              width={600}
              height={400}
              className="w-full h-[250px] md:h-[300px] object-cover"
            />
          </div>
        ))}
      </div>

      {/* Mission Statement */}
      <section className="mt-15 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
          Our Mission
        </h2>
        <hr />
        <p className="text-lg text-gray-600 max-w-5xl mx-auto">
          To deliver the best grocery experience online — with fresh inventory, transparent pricing, trusted brands, and a promise of doorstep convenience across India.
        </p>
      </section>

      {/* Mission Details */}
      <section className="mt-2 text-lg text-gray-700 leading-relaxed md:px-6">
        <p>
          At Goyat Trading, every order matters. We prioritize fast order processing, on-time delivery, and clear communication to build customer trust.
        </p>
        <p>
          We focus on responsible sourcing, sustainable packaging, and working with local producers to reduce waste and support community growth.
        </p>
        <p>
          We constantly evolve by listening to customer feedback, adapting to market needs, and introducing better features and product lines.
        </p>
        <p>
          From groceries to gifting, snacks to staples — Goyat Trading is built to serve every age group and lifestyle need, right from your mobile or desktop.
        </p>
      </section>

      {/* Topics Covered */}
      <section className="mt-16 flex flex-col md:flex-row gap-10 px-4 md:px-0">
        <div className="w-full md:w-1/2">
          <Image
            src={aboutimage3}
            alt="Grocery categories"
            width={700}
            height={700}
            className="rounded-xl shadow-md"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-5 text-lg leading-relaxed">
          <p className="font-medium">
            Product Categories Available at Goyat Trading:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Fresh Fruits & Vegetables</li>
            <li>Dairy, Eggs & Bakery</li>
            <li>Rice, Atta & Pulses</li>
            <li>Oils, Ghee & Spices</li>
            <li>Breakfast Cereals & Snacks</li>
            <li>Beverages & Tea/Coffee</li>
            <li>Cleaning & Household Essentials</li>
            <li>Beauty, Health & Personal Care</li>
            <li>Baby & Pet Care</li>
            <li>Organic, Gourmet & Premium Products</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
