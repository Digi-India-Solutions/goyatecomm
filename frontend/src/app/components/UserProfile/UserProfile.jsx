"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import userImage from "../../Images/DowloadImage/testi6.jpg";
import bookimage1 from "../../Images/DBS/1.jpg";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Download,
  Edit,
  HelpCircle,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  User,
  BookOpenText,
  ShoppingCartIcon,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Cart from "../Cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";
import {
  handleLogout,
  resetState,
  updateProfileImg,
  updateUser,
} from "@/app/redux/features/auth/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getOrder } from "@/app/redux/features/order/orderSlice";
import toast from "react-hot-toast";
import { serverUrl } from "@/app/redux/features/axiosInstance";
import { resetWishlistState } from "@/app/redux/wishlistSlice";
import { resetCartState } from "@/app/redux/AddtoCart/apiCartSlice";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("orders");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const { user,loading } = useSelector((state) => state.login);
  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I track my order?",
      answer:
        "You can track your order by going to the 'My Orders' section and clicking on the order you want to track. There you'll find the current status of your delivery and tracking information.",
    },
    {
      question: "How can I return an item?",
      answer:
        "To return an item, go to your orders, select the item, and follow the return instructions. Ensure it's within the return window.",
    },
    {
      question: "What is your refund policy?",
      answer:
        "We process refunds within 5-7 business days after receiving the returned item, subject to its condition.",
    },
    {
      question: "How do I change my password?",
      answer:
        "Go to Account Settings > Security > Change Password. You’ll need to enter your current password.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach out to our support team via the Contact Us page or email us at support@example.com.",
    },
  ];

  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { order: orders } = useSelector((state) => state.order);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const loading = toast.loading("Updating image...");
    dispatch(updateProfileImg({ image: file }))
      .unwrap()
      .then(() => {
        toast.dismiss(loading);
        setSelectedFile(URL.createObjectURL(file));
        toast.success("Image updated successfully");
      })
      .catch((err) => {
        toast.dismiss(loading);
        toast.error(err || "Something went wrong");
      });
  };

  const handleSaveChanges = () => {
    let payload = {
      fullName: formData.fullName,
      city: formData.city,
      phone: formData.phone,
      address: formData.address,
    };
    dispatch(updateUser(payload))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully");
      })
      .catch((error) => {
        toast.error("Failed to update profile");
        console.error("Update error:", error);
      })
      .finally(() => {
        setIsEditingProfile(true);
      });
  };

  const handleLogoutFun = () => {
    handleLogout();
    dispatch(resetState());
  dispatch(resetWishlistState());
  dispatch(resetCartState())
    router.push("/");
  };
  // Handle order selection
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  // Handle back to orders list
  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
    dispatch(getOrder());

    setFormData({
      name: formData?.fullName,
      city: formData?.city,
      phone: formData?.phone,
      address: formData?.address,
    });
  }, []);
  console.log("user", user);
  console.log("loading", loading);
  
if(loading || !user){
  console.log("loading", loading);
  
  return <div>Loading...</div>
}
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold green">My Profile</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <BookOpenText className="h-6 w-6 text-gray-600" />
              </button>
              <div className="relative">
                <Image
                  src={
                    selectedFile
                      ? selectedFile
                      : user?.profileImage
                      ? user.profileImage.includes("picsum.photos") ||
                        user.profileImage.includes("res.cloudinary.com")
                        ? user.profileImage
                        : `${serverUrl}/public/image/${user.profileImage}`
                      : CallBackImg
                  }
                  alt="Profile"
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            {/* <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <Image
                    src={user.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-purple-500"
                  />
                  <button
                    className="absolute bottom-0 right-0 green text-white p-1 rounded-full"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <nav className="space-y-2 flex flex-row flex-wrap justify-center md:flex-col">
                <button
                  className={`flex items-center space-x-3 md:w-full p-2 md:p-3 rounded-lg ${
                    activeTab === "orders"
                      ? "bg-purple-100 green"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveTab("orders");
                    setSelectedOrder(null);
                  }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>My Orders</span>
                </button>
                <button
                  className={`flex items-center space-x-3 md:w-full p-2 md:p-3 rounded-lg ${
                    activeTab === "wishlist"
                      ? "bg-purple-100 green"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveTab("wishlist");
                    setSelectedOrder(null);
                  }}
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                </button>
                <button
                  className={`flex items-center space-x-3 md:w-full p-2 md:p-3 rounded-lg ${
                    activeTab === "cart"
                      ? "bg-purple-100 green"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveTab("cart");
                    setSelectedOrder(null);
                  }}
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span>Cart</span>
                </button>
                <button
                  className={`flex items-center space-x-3 md:w-full p-2 md:p-3 rounded-lg ${
                    activeTab === "profile"
                      ? "bg-purple-100 green"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveTab("profile");
                    setIsEditingProfile(true);
                  }}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>
                <button
                  className={`flex items-center space-x-3 md:w-full p-2 md:p-3 rounded-lg ${
                    activeTab === "help"
                      ? "bg-purple-100 green"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveTab("help");
                    setSelectedOrder(null);
                  }}
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Help Center</span>
                </button>
                <button
                  className={`flex items-center space-x-3 md:w-full p-2 md:p-3 rounded-lg ${
                    activeTab === "settings"
                      ? "bg-purple-100 green"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveTab("settings");
                    setSelectedOrder(null);
                  }}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <button
                  className="flex items-center space-x-3 md:w-full p-2 md:p-3 rounded-lg text-red-600 hover:bg-red-50"
                  onClick={handleLogoutFun}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </nav>
            </div> */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center mb-6">
                {/* Profile Image + Edit Button */}
                <div className="relative mb-4">
                  <Image
                    src={
                      selectedFile
                        ? selectedFile
                        : user?.profileImage
                        ? user.profileImage.includes("picsum.photos") ||
                          user.profileImage.includes("res.cloudinary.com")
                          ? user.profileImage
                          : `${serverUrl}/public/image/${user.profileImage}`
                        : "/placeholder.svg"
                    }
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-purple-500 object-cover"
                  />

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {/* Edit Icon (clicking opens file picker) */}
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 green text-white p-1 rounded-full"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>

                <h2 className="text-xl font-semibold">{user?.fullName}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <nav className="space-y-2 flex flex-row flex-wrap justify-center md:flex-col">
                <button
                  className={`flex items-center space-x-3 md:w-full p-2 md:p-3 rounded-lg ${
                    activeTab === "orders"
                      ? "bg-purple-100 green"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveTab("orders");
                  }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>My Orders</span>
                </button>
                <button
                  className={`flex items-center space-x-3 md:w-full p-2 md:p-3 rounded-lg ${
                    activeTab === "wishlist"
                      ? "bg-purple-100 green"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveTab("wishlist");
                  }}
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                </button>
                <button
                  className={`flex items-center space-x-3 md:w-full p-2 md:p-3 rounded-lg ${
                    activeTab === "cart"
                      ? "bg-purple-100 green"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveTab("cart");
                  }}
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span>Cart</span>
                </button>
                <button
                  className={`flex items-center space-x-3 md:w-full p-2 md:p-3 rounded-lg ${
                    activeTab === "profile"
                      ? "bg-purple-100 green"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveTab("profile");
                    setIsEditingProfile(true);
                  }}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>
                <button
                  className={`flex items-center space-x-3 md:w-full p-2 md:p-3 rounded-lg ${
                    activeTab === "help"
                      ? "bg-purple-100 green"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveTab("help");
                  }}
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Help Center</span>
                </button>
                {/* <button
                  className={`flex items-center space-x-3 md:w-full p-2 md:p-3 rounded-lg ${
                    activeTab === "settings"
                      ? "bg-purple-100 green"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveTab("settings");
                  }}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button> */}
                <button
                  className="flex items-center space-x-3 md:w-full p-2 md:p-3 rounded-lg text-red-600 hover:bg-red-50"
                  onClick={handleLogoutFun}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-3/4">
            {activeTab === "orders" && !selectedOrder && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">
                    My Orders
                  </h2>
                  <p className="text-gray-600">View and manage your orders</p>
                </div>
                <div className="p-6">
                  {orders?.length > 0 ? (
                    <div className="space-y-4">
                      {orders?.map((order) => (
                        <div
                          key={order._id}
                          className="border border-purple-600 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                          onClick={() => handleOrderClick(order)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {order?.orderUniqueId}
                              </h3>
                              <p className="text-gray-600">
                                {new Date(
                                  order?.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                ₹{Math.round(order?.totalAmount)}
                              </p>
                              <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                {order?.orderStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">
                        No orders yet
                      </h3>
                      <p className="mt-1 text-gray-500">
                        Start shopping to see your orders here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "orders" && selectedOrder && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <button
                    className="flex items-center green hover:green mb-4"
                    onClick={handleBackToOrders}
                  >
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Back to Orders
                  </button>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Order{" "}
                        {new Date(selectedOrder?.createdAt)?.toLocaleString()}
                      </h2>
                      {/* <p className="text-gray-600">
                        Placed on {selectedOrder.date}
                      </p> */}
                    </div>
                    <button className="flex items-center px-4 py-2 green text-white rounded-lg hover:bg-purple-700">
                      <Download className="h-4 w-4 mr-2" />
                      Invoice
                    </button>
                  </div>
                </div>

                {/* Delivery Progress */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">
                    Delivery Status
                  </h3>
                  {/* <div className="relative">
                    <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-300"></div>
                    {selectedOrder?.deliverySteps?.map((step, index) => (
                      <div
                        key={step.id}
                        className="relative flex items-start mb-6 last:mb-0"
                      >
                        <div
                          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                            step.completed ? "green" : "bg-gray-200"
                          }`}
                        >
                          {step.completed && (
                            <div className="h-3 w-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-md font-medium">{step.name}</h4>
                          {step.completed && (
                            <p className="text-sm text-gray-500">{step.date}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div> */}
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">
                      Order Tracking
                    </h2>
                    {[
                      "Placed",
                      "Confirmed",
                      "Shipped",
                      "Delivered",
                      "Cancelled",
                    ].map((step, index) => {
                      const currentStatus = selectedOrder?.orderStatus || "";
                      const currentStepIndex = [
                        "Placed",
                        "Confirmed",
                        "Shipped",
                        "Delivered",
                        "Cancelled",
                      ].indexOf(currentStatus);
                      const completed =
                        currentStatus !== "Cancelled" &&
                        index <= currentStepIndex;

                      return (
                        <div
                          key={step}
                          className="relative flex items-start mb-6 last:mb-0"
                        >
                          <div
                            className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                              completed ? "bg-green-500" : "bg-gray-200"
                            }`}
                          >
                            {completed && (
                              <div className="h-3 w-3  rounded-full" />
                            )}
                          </div>
                          <div className="ml-4">
                            <h4 className="text-md font-medium">{step}</h4>
                            {completed && (
                              <p className="text-sm text-gray-500">
                                Status: {step}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <Image
                            src={
                              item?.productId?.images[0]
                                ? `${serverUrl}/public/image/${item.productId.images[0]}`
                                : "/placeholder.svg"
                            }
                            // src={item.image || "/placeholder.svg"}
                            alt={
                              item?.name || item?.productId?.title || "Product"
                            }
                            width={80}
                            height={80}
                            className="rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">
                    Delivery Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Delivery Address
                      </h4>
                      <p className="text-gray-800">
                        {selectedOrder?.shippingAddress?.address}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Tracking Number
                      </h4>
                      <p className="text-gray-800">
                        {selectedOrder?.orderUniqueId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>
                        {selectedOrder?.totalAmount +
                          selectedOrder?.shippingCost}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>
                        {selectedOrder?.shippingCost > 0
                          ? selectedOrder?.shippingCost
                          : "Free"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">
                       Rs. {Math.round(selectedOrder?.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-lg shadow">
                <Wishlist />
              </div>
            )}
            {activeTab === "cart" && (
              <div>
                <Cart />
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">
                    My Profile
                  </h2>
                  <p className="text-gray-600">
                    Manage your personal information
                  </p>
                </div>
                <div className="p-6">
                  {!isEditingProfile ? (
                    <form className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            defaultValue={user?.fullName}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                fullName: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div className="w-full md:w-1/2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            defaultValue={user.email}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            defaultValue={user?.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div className="w-full md:w-1/2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="tel"
                            defaultValue={user?.city}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                city: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        {/* <div className="w-full md:w-1/2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profile Image
                          </label>
                          <div className="flex items-center">
                            <Image
                              src={user?.profileImage || "/placeholder.svg"}
                              alt="Profile"
                              width={80}
                              height={80}
                              className="rounded-full mr-4"
                            />
                            <button
                              type="button"
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                              Change Image
                            </button>
                          </div>
                        </div> */}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <textarea
                          defaultValue={user?.address}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        ></textarea>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          onClick={() => setIsEditingProfile(true)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="px-6 py-2 green text-white rounded-lg hover:bg-purple-700"
                          onClick={handleSaveChanges}
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Full Name
                          </h3>
                          <p className="mt-1 text-gray-900">
                            {user?.fullName || "-"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Email Address
                          </h3>
                          <p className="mt-1 text-gray-900">
                            {user?.email || "-"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Phone Number
                          </h3>
                          <p className="mt-1 text-gray-900">
                            {user?.phone || "-"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Address
                          </h3>
                          <p className="mt-1 text-gray-900">
                            {user?.address || "-"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="px-6 py-2 green text-white rounded-lg hover:bg-purple-700"
                          onClick={() => setIsEditingProfile(false)}
                        >
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "help" && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Help Center
                  </h2>
                  <p className="text-gray-600">
                    Find answers to your questions
                  </p>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search for help..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          className="flex justify-between items-center w-full p-4 text-left font-medium"
                          onClick={() => toggleIndex(index)}
                        >
                          <span>{faq.question}</span>
                          {openIndex === index ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </button>

                        {openIndex === index && (
                          <div className="px-4 pb-4">
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold green mb-2">
                      Need more help?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Our customer support team is available 24/7 to assist you.
                    </p>
                    <Link href={"/pages/contact"}>
                      <button className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800">
                        Contact Support
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-300">
                  <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                  <p className="text-gray-600">Manage your account settings</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Notifications
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Order Updates</h4>
                            <p className="text-sm text-gray-500">
                              Receive updates about your orders
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              defaultChecked
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:green"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Promotions</h4>
                            <p className="text-sm text-gray-500">
                              Receive promotional offers and discounts
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              defaultChecked
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:green"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-300">
                      <button className="px-6 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
