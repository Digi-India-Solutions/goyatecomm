"use client";
import React, { useEffect, useRef, useState } from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import EmptyCart from "../../Images/DowloadImage/EmptyCart.png";
import toast from "react-hot-toast";
import Image from "next/image";
import product1 from "../../Images/DBS/1.jpg";
import { useSelector, useDispatch } from "react-redux";
import {
  applyCoupon,
  calculateTotalsLoad,
  removeFromCart,
  setApplyCoupon,
  updateCartState,
  updateQuantity,
} from "@/app/redux/AddtoCart/cartSlice";
import Link from "next/link";
import {
  addToCartAPIThunk,
  getAllCartItemsAPI,
  removeFromCartAPI,
  removeFromCartState,
  updateStateQuantity,
} from "@/app/redux/AddtoCart/apiCartSlice";
import axiosInstance, {
  debounce,
  serverUrl,
} from "@/app/redux/features/axiosInstance";
import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";
import EmptyWishlist from "../../Images/DowloadImage/EmptyCart.png";
import { useRouter } from "next/navigation";
export default function Cart() {
  const { cartItems, totalAmount, tax, discountAmount, total, couponCode } =
    useSelector((state) => state.cart);
  const { items, loading } = useSelector((state) => state.apiCart);
  const { coupons } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.login);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [hasOutOfStockItems, setHasOutOfStockItems] = useState(false);
  const debouncedUpdateAPI = useRef(
    debounce((id, quantity) => {
      dispatch(addToCartAPIThunk({ productId: id, quantity }));
    }, 500)
  ).current;
  // const latestQuantityMap = useRef(new Map());
  // const prevQuantityMap = useRef(new Map());
  const dispatch = useDispatch();
  // console.log("latestQuantityMap:", latestQuantityMap);
  // console.log("prevQuantityMap:", prevQuantityMap);

  // const debouncedUpdateAPI = useRef(
  //   debounce(() => {
  //     console.log("⏱ Debounce triggered");
  //     latestQuantityMap.current.forEach((latestQty, id) => {
  //       const prevQty = prevQuantityMap.current.get(id) ?? latestQty;
  //       const delta = latestQty - prevQty;
  //       console.log(
  //         "latestQty:",
  //         latestQty,
  //         "prevQty:",
  //         prevQty,
  //         "delta:",
  //         delta
  //       );

  //       if (delta !== 0) {
  //         console.log("🔁 Dispatching API with delta:", { id, delta });
  //         dispatch(addToCartAPIThunk({ productId: id, quantity: delta }));
  //         prevQuantityMap.current.set(id, latestQty);
  //       }
  //     });
  //   }, 500)
  // ).current;

  let cartItemsValue = [];

  if (user?.email) {
    cartItemsValue = items;
  } else {
    cartItemsValue = cartItems;
  }
  const router = useRouter();
  console.log("cartItemsValue:", cartItemsValue);

  const [couponCodeInput, setCouponCode] = useState("");

  let newQty = 0;
  const handleRemoveItem = (item) => {
    if (item.quantity > 1) {
      if (user?.email) {
        // newQty--;
        // dispatch(
        //   updateStateQuantity({
        //     id: item.productId._id,
        //     quantity: -1,
        //   })
        // );
        dispatch(
          addToCartAPIThunk({ productId: item.productId._id, quantity: -1 })
        );
      } else {
        dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
        // dispatch(removeFromCart(item.id));
        // toast.success(`${item.name} removed from cart`);
      }
    }
  };

  let addnewQty = 0;
  const handleAddItem = (item) => {
    const newQty = item.quantity + 1;
    addnewQty++;
    if (user?.email) {
      // dispatch(
      //   updateStateQuantity({ id: item.productId._id, quantity: 1 })
      // );
      dispatch(
        addToCartAPIThunk({ productId: item.productId._id, quantity: 1 })
      );
    } else {
      dispatch(updateQuantity({ id: item.id, quantity: newQty }));
    }
  };

  // const handleRemoveItem = (item) => {
  //   const id = item.productId._id;
  //   const newQty = item.quantity - 1;

  //   if (newQty >= 1) {
  //     // Update Redux state immediately for UI
  //     dispatch(updateStateQuantity({ id, quantity: -1 }));

  //     // Logged-in flow
  //     if (user?.email) {
  //       latestQuantityMap.current.set(id, newQty);
  //       debouncedUpdateAPI(); // Triggers debounce
  //     } else {
  //       dispatch(updateQuantity({ id: item.id, quantity: newQty }));
  //       toast.success(`${item.name} removed from cart`);
  //     }
  //   }
  // };

  // const handleAddItem = (item) => {
  //   const id = item.productId._id;
  //   const newQty = item.quantity + 1;

  //   dispatch(updateStateQuantity({ id, quantity: 1 }));

  //   if (user?.email) {
  //     latestQuantityMap.current.set(id, newQty);
  //     debouncedUpdateAPI(); // Triggers debounce
  //   } else {
  //     dispatch(updateQuantity({ id: item.id, quantity: newQty }));
  //   }
  // };

  const handleDeleteProduct = (id) => {
    if (user?.email) {
      dispatch(removeFromCartState(id));
      dispatch(removeFromCartAPI(id));
      toast.error("Product removed from cart");
    } else {
      dispatch(removeFromCart(id));
      toast.error("Product removed from cart");
    }
  };

  const subtotal = cartItemsValue.reduce((acc, item) => {
    const price = item?.price ?? item?.productId?.price ?? 0;
    return acc + price * item.quantity;
  }, 0);

  let discountAmountValue = 0;
  if (user?.email) {
    discountAmountValue = cartItemsValue.reduce((acc, item) => {
      const price = item.productId?.price;
      const finalPrice = item.productId?.finalPrice;
      const discountPrice = price - finalPrice;
      return acc + discountPrice * item.quantity;
    }, 0);
  } else {
    discountAmountValue = cartItemsValue.reduce((acc, item) => {
      const price = item.price;
      const finalPrice = item.finalPrice;
      const discountPrice = price - finalPrice;
      return acc + discountPrice * item.quantity;
    }, 0);
  }
  // Shipping logic
  const shippingCost = subtotal >= 500 ? 0 : 20;

  // Final Total
  const baseAmount = subtotal - discountAmountValue;

  const adjustedCouponDiscount =
    couponDiscount < 100 ? (baseAmount * couponDiscount) / 100 : couponDiscount;

  const finalTotal = baseAmount + shippingCost - adjustedCouponDiscount;
  const handleHasOutOfStockItems = () => {
    if (user?.email) {
      console.log("........cartItemsValue:", cartItemsValue);
      
      const items = cartItemsValue?.some(
        (item) => item?.productId?.stock===0
      );
      console.log(".......items:", items);
      
      setHasOutOfStockItems(items);
    } else {
      const items = cartItemsValue?.some((item) => item.isOutOfStock);
      setHasOutOfStockItems(items);
    }
  };
  useEffect(() => {
    dispatch(calculateTotalsLoad());
    dispatch(getAllCartItemsAPI());
   
  }, [dispatch, cartItems]);
  console.log("cartitems:", cartItems);

  useEffect(() => {
     handleHasOutOfStockItems();
  },[cartItemsValue]);
  // useEffect(() => {
  //   if(!loading) return
  //   console.log("items:", items);
  //   if (user?.email && items.length > 0) {

  //     items.forEach((item) => {
  //       prevQuantityMap.current.set(item.productId._id, item.quantity);
  //     });
  //   }
  // }, [user?.email]);

  const initializedRef = useRef(false);

  // useEffect(() => {
  //   // Prevent overriding if already set, loading not done, or user not logged in
  //   console.log("items:", items);
  //    const testObj = {};
  // items.forEach((item) => {
  //   const id = item?.productId?._id;
  //   const qty = item.quantity;
  //   if (id) {
  //     testObj[id] = qty;
  //   }
  // });
  // console.log("✅ testObj output:", testObj);
  //   if (!user?.email || loading || initializedRef.current) return;
  //   console.log("items:", items);

  //   if (items.length > 0) {
  //     items.forEach((item) => {
  //       const id = item.productId._id;
  //       const quantity = item.quantity;
  //       prevQuantityMap.current.set(id, quantity);
  //     });

  //     initializedRef.current = true; // 🚫 Don’t allow reinitialization
  //     console.log("✅ prevQuantityMap initialized", prevQuantityMap.current);
  //   }
  // }, [user?.email, loading, items]);

  useEffect(() => {
    const cartFromLocal = JSON.parse(localStorage.getItem("cart")) || [];

    const fetchLatestProducts = async () => {
      try {
        const productIds = cartFromLocal.map((item) => item.id);
        const res = await axiosInstance.post(
          "/product/get-multiple-products-by-id",
          { productIds }
        );

        const latestProducts = res?.data?.products;

        const mergedCart = cartFromLocal.map((item) => {
          const productInfo = latestProducts.find((p) => p._id === item.id);
          return {
            ...item,
            isOutOfStock: productInfo?.stock === 0,
          };
        });
        console.log("mergedCart:", mergedCart);

        dispatch(updateCartState(mergedCart));
      } catch (err) {
        console.error("Error syncing cart with stock:", err);
      }
    };

    fetchLatestProducts();
  }, []);

  const handleCheckout = () => {
    if(!user?.email) {
      toast.error("Please login to proceed to checkout.");
      router.push("/pages/login");
      return;
    }
    router.push("/pages/checkout");
  };
  if (cartItemsValue?.length === 0) {
    return (
      <div className="mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={EmptyWishlist} // ✅ Replace with your image path
            alt="Empty Wishlist"
            className="w-60 h-60 object-contain opacity-100"
          />
          <p className="green text-lg font-bold">
            Your Cart is empty.
          </p>
          <p className="text-sm text-black font-semibold">
            Start exploring and add items you like!
          </p>
          <Link href="/">
            <button className="mt-4 black-btn">Continue Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  cartItemsValue.map((item) => {
    console.log("item", item?.image ? "IMAGE NOT" : item?.productId?.images);
  });

  return (
    <div className="mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-xl font-bold mb-4">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div
            className="bg-white shadow-lg rounded p-5"
            style={{
              maxHeight: "700px",
              overflowY: "auto",
            }}
          >
            <div className="flex justify-around items-start text-sm font-semibold text-gray-500 mb-4">
              <div>Image</div>
              <div>Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
            </div>

            <div className="space-y-4 pr-2">
              {cartItemsValue?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row flex-wrap justify-between items-center gap-2 md:gap-4 border-b border-gray-300 pb-4"
                >
                  <div>
                    <Link
                      href={`/pages/shop/${item?.productId?._id ?? item?.id}`}
                    >
                      <Image
                        src={
                          item?.image
                            ? `${serverUrl}/public/image/${item.image}`
                            : item?.productId?.images?.[0]
                            ? `${serverUrl}/public/image/${item.productId.images[0]}`
                            : item?.productId?.image
                            ? `${serverUrl}/public/image/${item.productId.image}`
                            : CallBackImg
                        }
                        alt="Product Image"
                        width={60}
                        height={60}
                        className="rounded-md object-contain"
                      />
                    </Link>
                  </div>
                  <div className="font-medium">
                    {(item?.name ?? item?.productId?.title)?.length > 30
                      ? (item?.name ?? item?.productId?.title).slice(0, 30) +
                        "..."
                      : item?.name ?? item?.productId?.title}
                  </div>
                  <div className="text-center">
                    ₹{item?.finalPrice ?? item?.productId?.finalPrice}
                  </div>
                  {( item?.isOutOfStock || item?.productId?.stock!==0 ) && (
                    <>
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            handleRemoveItem(item);
                          }}
                          className="p-2 rounded text-dark bg-gray-200 hover:bg-gray-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <input
                          type="number"
                          // min="1"
                          min={1}
                          value={item.quantity}
                          readOnly
                          className="w-10 text-center border border-gray-300 rounded"
                        />

                        <button
                          onClick={() => {
                            handleAddItem(item);
                          }}
                        >
                          <Plus />
                        </button>
                      </div>
                    </>
                  )}

                  {(item?.isOutOfStock || item?.productId?.stock===0) && (
                    <div className="text-sm text-red-600 font-semibold">
                      Out of Stock
                    </div>
                  )}
                  <div className="text-right flex justify-end items-center space-x-2">
                    <span>
                      ₹
                      {(item?.price ?? item?.productId?.finalPrice) *
                        item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        handleDeleteProduct(item?.id ?? item?.productId?._id);
                      }}
                      className="text-red-500 hover:underline"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-lg rounded p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {/* <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div> */}
              <div className="flex justify-between">
                <span>Shipping Cost</span>
                <span>₹{shippingCost}</span>
              </div>
              {discountAmountValue > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{Number(discountAmountValue.toFixed(2))}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Coupon Discount</span>
                  <span>
                    -{`${couponDiscount > 100 ? "₹" : ""}`}
                    {couponDiscount}
                    {couponDiscount < 100 ? "%" : ""}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{Math.floor(finalTotal)}</span>
              </div>
            </div>

            {/* Coupon Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const coupon = coupons.find(
                  (coupon) => coupon.couponCode == couponCodeInput
                );

                if (!coupon) {
                  toast.error("Please enter a valid coupon code.");
                  setCouponDiscount(0);
                  return;
                }
                if (coupon.minAmount > finalTotal) {
                  toast.error("Minimum amount should be " + coupon.minAmount);
                  setCouponDiscount(0);
                  return;
                }
                if (coupon.maxAmount < finalTotal) {
                  toast.error("Maximum amount should be " + coupon.maxAmount);
                  setCouponDiscount(0);
                  return;
                }
                // dispatch(applyCoupon(couponCodeInput));

                if (couponCodeInput === coupon.couponCode) {
                  setCouponDiscount(coupon.discount);
                  dispatch(
                    setApplyCoupon({
                      couponCode: coupon.couponCode,
                      discount: coupon.discount,
                    })
                  );
                  toast.success("Coupon Applied Successfully!");
                  return;
                } else {
                  toast.error("Please enter a valid coupon code.");
                  setCouponDiscount(0);
                  return;
                }
              }}
              className="mt-4 space-y-2"
            >
              <label htmlFor="coupon" className="text-sm font-medium">
                Coupon Code
              </label>
              <input
                type="text"
                id="coupon"
                placeholder="Enter code"
                value={couponCodeInput}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full border border-gray-300 focus:outline-purple-600 rounded px-3 py-2"
              />
              <button
                type="submit"
                className="w-full purple-btn"
                disabled={!couponCodeInput.trim()}
              >
                Apply Coupon
              </button>
            </form>

            <button
              className={`w-full ${
                hasOutOfStockItems ? "bg-gray-400" : "bg-black cursor-pointer"
              } text-white py-2 rounded text-lg`}
              disabled={hasOutOfStockItems}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            <div className="text-center text-xs text-gray-500 mt-2">
              <p>🔒 Secure checkout powered by GOYAT TRADING</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
