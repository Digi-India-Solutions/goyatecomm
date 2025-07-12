import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../Header/Header";
import Dashboard from "../../Pages/Dashboard/Dashboard";
import AllProduct from "../../Pages/Products/AllProduct";
import AddProduct from "../../Pages/Products/AddProduct";
import AllVoucher from "../../Pages/Vouchers/AllVoucher";
import CreateVoucher from "../../Pages/Vouchers/AddVoucher";
import AllOrder from "../../Pages/Orders/AllOrder";
import EditOrder from "../../Pages/Orders/EditOrder";
import AllUsers from "../../Pages/Users/AllUsers";
import AllColor from "../../Pages/Color/AllColor";
import AddColor from "../../Pages/Color/AddColor";
import EditColor from "../../Pages/Color/EditColor";
import AllCertificate from "../../Pages/Certificate/AllCertificate";
import AddCertificate from "../../Pages/Certificate/AddCertificate";
import EditCertificate from "../../Pages/Certificate/EditCertificate";
import AllFlavour from "../../Pages/Flavour/AllFlavour";
import AddFlavour from "../../Pages/Flavour/AddFlavour";
import EditFlavour from "../../Pages/Flavour/EditFlavour";
import AllBanner from "../../Pages/Banner/AllBanner";
import AddBanner from "../../Pages/Banner/AddBanner";
import EditBanner from "../../Pages/Banner/EditBanner";
import EditProduct from "../../Pages/Products/EditProduct ";
import Login from "../auth/Login";
import AllDieses from "../../Pages/MainCategory/AllDieses";
import AddCategory from "../../Pages/MainCategory/AddCategory";
import EditCategory from "../../Pages/MainCategory/EditCategory";
import AddCoupen from "../../Pages/Coupon/AddCoupon";
import AllCoupen from "../../Pages/Coupon/AllCoupon";
import EditCoupen from "../../Pages/Coupon/EditCoupon";
import AllReviews from "../../Pages/Reviews/AllReviews";
import AllCart from "../../Pages/Cart/AllCart";
import ResetPassword from "../auth/ResetPassword";
import { elements } from "chart.js";
import AllWishList from "../../Pages/WishList/AllWishList";
import AllRewardPoint from "../../Pages/RewardPoints/AllRewardPoint";
import ViewDetails from "../../Pages/RewardPoints/ViewDetails";
import AllVideios from "../../Pages/VideoUrl/AllVideios";
import AddVideos from "../../Pages/VideoUrl/AddVideios";
import EditVideios from "../../Pages/VideoUrl/EditVideios";
import axiosInstance from "../../services/FetchNodeServices";
import { toast } from "react-toastify";
import AllInquiries from "../../Pages/Inquiry/Inquiry";
import EditSubCategory from "../../Pages/Category/EditSubCategory";
import AddSubCategory from "../../Pages/Category/AddSubCategory";
import AllCategory from "../../Pages/Category/AllSubCategory";
import AllFranchise from "../../Pages/Franchise/Franchise";
import ExcelProductUploader from "../../Pages/Products/MultiProduct";
import ExcelCategoryUploader from "../../Pages/MainCategory/MultiCategory";
import ImageUploader from "../../Pages/Products/UploadProductsImages";
import AllLevelImages from "../../Pages/LevelImage/AllLevelImage";
import ExcelSubToProductUploader from "../../Pages/Products/SubcategoryToProduct";
import ExcelMultipleSubcategory from "../../Pages/Category/MultipleSubcategory";
import ExcelCategoryAndSubcategory from "../../Pages/Category/ExcelCategoryAndSubcategory";
import AllSubCategory from "../../Pages/SubCategory/AllSubCategory";
import UpdateProductCurrency from "../../Pages/Products/UpdateProductCurrency";
import AddLevel from "../../Pages/LevelImage/AddLevel";
import EditLevel from "../../Pages/LevelImage/EditLevel";
import AddSubSubCategory from "../../Pages/SubCategory/AddSubCategory";
import EditSubSubCategory from "../../Pages/SubCategory/EditSubSubCategory";
import ExcelProductStockUploader from "../../Pages/Products/ExcelProductStockUploader";
import UploadOrders from "../../Pages/Orders/Order";

const Home = () => {
  const [login, setLogin] = useState(false);

  const verifyAdmin = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/auth/admin/verify-admin"
      );
      if (response.status === 200) {
        setLogin(true);
      }
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        setLogin(false);
      } else {
        setLogin(false);
        console.log("error", error);
        toast.error(error?.response?.data?.message || "Login failed");
      }
    }
  };

  useEffect(() => {
    verifyAdmin();
  }, []);
  return (
    <>
      {login ? (
        <>
          <Header />
          <div className="rightside">
            <Routes>
              <Route path={"/"} element={<Dashboard />} />
              {/* Color */}
              {/* <Route path={"/all-color"} element={<AllColor />} />
              <Route path={"/add-color"} element={<AddColor />} />
              <Route path={"/edit-color/:id"} element={<EditColor />} /> */}
              {/* certificate */}
              {/* <Route path={"/all-certificate"} element={<AllCertificate />} />
              <Route path={"/add-certificate"} element={<AddCertificate />} />
              <Route
                path={"/edit-certificate/:id"}
                element={<EditCertificate />}
              /> */}
              {/* Flover */}
              {/* <Route path={"/all-flower"} element={<AllFlavour />} />
              <Route path={"/add-flover"} element={<AddFlavour />} />
              <Route path={"/edit-flover/:id"} element={<EditFlavour />} /> */}
              {/* Product --  */}
              <Route path={"/all-products"} element={<AllProduct />} />
              <Route path={"/add-product"} element={<AddProduct />} />
              <Route path={"/edit-product/:id"} element={<EditProduct />} />
              <Route path={"/update-product-currency"} element={<UpdateProductCurrency />} />
              {/* Category --  */}
              <Route path={"/all-maincategory"} element={<AllDieses />} />
              <Route path={"/add-maincategory"} element={<AddCategory />} />
              <Route path={"/edit-maincategory/:id"} element={<EditCategory />} />
              <Route path={"/all-category"} element={<AllCategory />} />
              <Route path={"/add-category"} element={<AddSubCategory />} />
              <Route path={"/all-sub-category"} element={<AllSubCategory />} />
              <Route path={"/add-sub-category"} element={<AddSubSubCategory />} />
              <Route path={"/edit-sub-category/:id"} element={<EditSubSubCategory />} />
              <Route
                path={"/edit-category/:id"}
                element={<EditSubCategory />}
              />
              {/* --- Orders --- */}
              <Route path={"/all-users"} element={<AllUsers />} />
              <Route
                path={"/add-multiproduct"}
                element={<ExcelProductUploader />}
              />
              <Route
                path={"/multiple-subcategory-to-product"}
                element={<ExcelSubToProductUploader />}
              />
              <Route path={"/all-products-images"} element={<ImageUploader />} />
              {/* --- Vouchers --- */}
              {/* <Route path={"/all-voucher"} element={<AllVoucher />} />{" "} */}
              {/* // All Vouchers */}
              {/* <Route path={"/add-voucher"} element={<CreateVoucher />} /> */}
              {/* --- Banners --- */}
              <Route path={"/all-banners"} element={<AllBanner />} />
              <Route path={"/add-banner"} element={<AddBanner />} />
              <Route path={"/edit-banner/:id"} element={<EditBanner />} />
              {/* --- Orders --- */}
              <Route path={"/all-orders"} element={<AllOrder />} />
              <Route path={"/order-details/:id"} element={<EditOrder />} />
              <Route path={"/all-coupon"} element={<AllCoupen />} />
              <Route path={"/edit-coupon/:id"} element={<EditCoupen />} />
              <Route path={"/add-coupon"} element={<AddCoupen />} />
              {/* all-Reviews */}
              {/* <Route path={"all-reviews"} element={<AllReviews />} /> */}
              {/* <Route path={"All-carts"} element={<AllCart />} /> */}
              {/* <Route path={"all-wishlist"} element={<AllWishList />} /> */}
              {/* <Route path={"all-rewardPoint"} element={<AllRewardPoint />} /> */}
              {/* <Route path={"View-Details"} element={<ViewDetails />} /> */}
              {/* all-HomePage-Videos-Url */}
              {/* <Route path={"/add-videos"} element={<AddVideos />} />
              <Route path={"/all-videos"} element={<AllVideios />} />
              <Route path={"edit-videos/:id"} element={<EditVideios />} /> */}
              <Route path={"/all-inquiries"} element={<AllInquiries />} />
              <Route path={"/all-level-images"} element={<AllLevelImages />} />
              <Route path={"/edit-level-image/:id"} element={<EditLevel />} />
              <Route path={"/add-level-image"} element={<AddLevel />} />
              <Route
                path={"/upload-multiproducts-images"}
                element={<ImageUploader />}
              />
              <Route path={"/upload-orders"} element={<UploadOrders />} />

              <Route path="/multiple-subcategory" element={<ExcelMultipleSubcategory />} />
              <Route path="/multiple-category-and-subcategory" element={<ExcelCategoryAndSubcategory />} />
              <Route path="/update-products-stock" element={<ExcelProductStockUploader />} />
              {/* <Route path={"/all-become-franchise"} element={<AllFranchise />} /> */}
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route
            path="/admin/reset-password/:token"
            element={<ResetPassword />}
          />
        </Routes>
      )}
    </>
  );
};

export default Home;
