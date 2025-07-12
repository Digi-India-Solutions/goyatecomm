"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import book1 from "../../Images/DBS/1.jpg";
// import book2 from "../../Images/DBS/1.jpg";
import { Loader2, Lock, ShoppingBag, Truck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCartItemsAPI } from "@/app/redux/AddtoCart/apiCartSlice";
import image from "../../Images/DBS/1.jpg";
import { createOrder } from "@/app/redux/features/order/orderSlice";
import toast from "react-hot-toast";
import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";
import { serverUrl } from "@/app/redux/features/axiosInstance";
import UPIQrDisplay from "@/app/components/Payment/UPIQrDisplay";
import Modal from "@/app/components/Payment/Model";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    paymentMethod: "",
    UTRId: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const {loading, error, user} = useSelector((state) => state.login);
  const { items } = useSelector((state) => state.apiCart);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const appiedCoupon = useSelector((state) => state.cart.appliedCoupon);
  const couponDiscount = appiedCoupon?.discount;

  let cartItemsValue = [];
  if (user?.email) {
    cartItemsValue = items;
  } else {
    cartItemsValue = cartItems;
  }

  const subtotal =
    cartItemsValue && cartItemsValue.length > 0
      ? cartItemsValue.reduce((total, item) => {
          const price = item?.productId?.finalPrice ?? item.price;
    

          return total + price * item.quantity;
        }, 0)
      : 0;

  const adjustedCouponDiscount =
    couponDiscount < 100 ? (subtotal * couponDiscount) / 100 : couponDiscount;


  // const tax = subtotal * 0.08;
  // const shipping = subtotal == 0 ? 0 : subtotal > 500 ? 0 : 50;
  const shipping=0
  const total = subtotal + shipping - Number(adjustedCouponDiscount ?? 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  useEffect(() => {
    dispatch(getAllCartItemsAPI());
  }, [dispatch]);
  
  const validateForm = () => {
    const newErrors = {};

    // Shipping info validation
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    // if(!formData.UTRId.trim()) newErrors.UTRId = "UTR ID is required";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Payment method is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!validateForm()) return;
    
    setShowScanner(true);
  };

  const handleCreateOrder = async () => {
      if(!formData.UTRId){
        toast.error("Please enter your UTR ID.");
        return;
      }
    const loader = toast.loading("Processing your order...");
    try {
    
      await dispatch(createOrder(formData)).unwrap();
      toast.dismiss(loader);
      toast.success("Order placed successfully!");
      router.push("/pages/userprofile");
    } catch (error) {
      toast.dismiss(loader);
      console.log("Checkout failed:", error);
      toast.error(error.message || "Something went wrong during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if(loading) return;
    if (!user?.email) {
      toast.error("Please login to continue with checkout.");
      router.push("/pages/login");
    }
  }, []);
  if(loading) {
    return <div>Loading...</div>
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold">
                    Shipping Information
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none ₹{
                        errors.firstName ? "border-red-500" : "border-gray-400"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none ₹{
                        errors.lastName ? "border-red-500" : "border-gray-400"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none ₹{
                        errors.email ? "border-red-500" : "border-gray-400"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Num
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none ₹{
                        errors.phone ? "border-red-500" : "border-gray-400"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address
                    </label>
                    <textarea
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none ₹{
                        errors.address ? "border-red-500" : "border-gray-400"
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none ₹{
                        errors.city ? "border-red-500" : "border-gray-400"
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none ₹{
                        errors.state ? "border-red-500" : "border-gray-400"
                      }`}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none ₹{
                        errors.zipCode ? "border-red-500" : "border-gray-400"
                      }`}
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    >
                      <option value="India">India</option>
                      {/* <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option> */}
                    </select>
                  </div>
                </div>
                <hr className="my-4 text-gray-400" />

                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-lg font-semibold text-gray-700 mb-1"
                  >
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  >
                    <option value="">Select Payment Method</option>
                    {/* <option value="COD">Cash on Delivery (COD)</option> */}
                    <option value="Online">Online Payment</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full hover:bg-green-500  bg-green-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {showScanner && (
                  <Modal
                    isOpen={showScanner}
                    onSubmit={() => {
                      handleCreateOrder();
                    }}
                    onClose={() => setShowScanner(false)}
                  >
                    <>
                      <UPIQrDisplay amount={Math.round(total)} />
                      <p className="text-sm text-gray-600 mt-4">
                       Enter your UTR Id
                      </p>
                      <input
                        type="text"
                        placeholder="Enter UTR ID"
                        className="mt-4 w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-green-600 focus:outline-none text-black"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            UTRId: e.target.value,
                          }))
                        }
                        value={formData.UTRId}
                      />
                    </>
                  </Modal>
                )}
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Complete Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>

              <div className="divide-y">
                {cartItemsValue?.length === 0 && (
                  <p className="text-gray-500 text-sm">Your cart is empty. </p>
                )}
                {cartItemsValue?.map((item, index) => (
                  <div
                    key={item?.id || item?._id || index}
                    className="py-4 flex gap-4"
                  >
                    <div className="w-auto h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={
                          item?.image
                            ? `${serverUrl}/public/image/${item.image}`
                            : item?.productId?.images?.[0]
                            ? `${serverUrl}/public/image/${item.productId.images[0]}`
                            : CallBackImg
                        }
                        alt={item?.name || item?.productId?.title || "product"}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {item.name ?? item.productId?.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-gray-900 font-medium mt-1">
                        ₹
                        {(
                          item.finalPrice ?? item.productId?.finalPrice
                        )?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">
                    ₹{subtotal?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">
                    ₹{shipping?.toFixed(2)}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-red-600 ">
                    <span>Coupon Discount</span>
                    <span>
                      -{`${couponDiscount > 100 ? "₹" : ""}`}
                      {couponDiscount}
                      {couponDiscount < 100 ? "%" : ""}
                    </span>
                  </div>
                )}
                {/* <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900 font-medium">
                    ₹{tax.toFixed(2)}
                  </span>
                </div> */}
                <div className="flex justify-between pt-2 border-t border-gray-200 text-base font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{Math.round(total)}</span>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="h-4 w-4" />
                  <p>Your payment information is encrypted and secure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
