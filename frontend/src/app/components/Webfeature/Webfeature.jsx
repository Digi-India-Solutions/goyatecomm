"use client";
import React from "react";
import payment from "../../Images/DowloadImage/payment.png";
import discount from "../../Images/DowloadImage/discount.png";
import truck from "../../Images/DowloadImage/truck.png";
import veritable from "../../Images/DowloadImage/FirstEdition.png";
import Image from "next/image";
import { motion } from "framer-motion";

const Webfeature = () => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-300">
      {/* Feature 1 */}
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image src={payment} alt="Secure Payments" width={50} height={50} />
        <h6 className="font-semibold text-base text-center">Secure Payments</h6>
      </motion.div>

      {/* Feature 2 */}
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Image src={discount} alt="Exciting Discounts" width={50} height={50} />
        <h6 className="font-semibold text-base text-center">
          Exciting Discounts
        </h6>
      </motion.div>

      {/* Feature 3 */}
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Image src={truck} alt="Fast Book Delivery" width={50} height={50} />
        <h6 className="font-semibold text-base text-center">
          Fast Book Delivery
        </h6>
      </motion.div>

      {/* Feature 4 */}
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Image src={veritable} alt="Original Editions" width={50} height={50} />
        <h6 className="font-semibold text-base text-center">
          Original Editions
        </h6>
      </motion.div>
    </div>
  );
};

export default Webfeature;
