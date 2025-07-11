import Link from "next/link";
import { CheckCircle, Home } from "lucide-react";

export default function page() {
  const getEstimatedDelivery = () => {
  const today = new Date();

  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 3);

  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 5);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const formattedStart = `${monthNames[startDate.getMonth()]} ${startDate.getDate()}`;
  const formattedEnd = `${endDate.getDate()}, ${endDate.getFullYear()}`;

  return `Estimated delivery: ${formattedStart}–${formattedEnd}`;
};
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 mb-6">
          🎉 Thanks for your purchase! We appreciate your order and hope you
          enjoy your items.
        </p>

        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
          <div className="text-sm text-gray-600 text-left">
            {/* <p className="font-medium text-gray-900 mb-1">Order #38492</p> */}
            <p>Estimated delivery: {getEstimatedDelivery()}</p>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 green hover:bg-purple-800 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          <Home className="h-4 w-4" />
          Return to Home
        </Link>
      </div>
    </div>
  );
}
