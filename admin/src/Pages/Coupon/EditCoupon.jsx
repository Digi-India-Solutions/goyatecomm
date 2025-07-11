import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, { postData } from "../../services/FetchNodeServices";

const AddCoupon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({
    couponCode: "",
    discount: "",
    couponTitle: "",
    minAmount: "",
    maxAmount: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();
  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData?.couponCode || !formData?.discount) {
      toast.error("Please fill all fields");
      setIsLoading(false);
      return;
    }

    if (formData?.discount < 0) {
      toast.error("Discount should be greater than 0");
      setIsLoading(false);
      return;
    }
    if(formData?.maxAmount < formData?.minAmount){
      toast.error("Max amount should be greater than min amount");
      setIsLoading(false);
      return;
    }
    let body = {
      couponCode: formData?.couponCode,
      discount: formData?.discount,
      title: formData?.couponTitle,
      minAmount: formData?.minAmount,
      maxAmount: formData?.maxAmount,
      isActive: isActive,
    };

    try {
      const response = await axiosInstance.put(
        `/api/v1/coupon/update-coupon/${id}`,
        body
      );
      if (response.status === 200) {
        toast.success(response?.data?.message || "Coupon created successfully");
        navigate("/all-coupon");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Error updating coupon";
      toast.error(errorMessage);
      console.error("Error updating coupon:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/coupon/get-coupon/${id}`
        );
        if (response.status === 200) {
          setFormData({
            couponCode: response?.data.data?.couponCode,
            discount: response?.data.data?.discount,
            couponTitle: response?.data.data?.title,
            minAmount: response?.data.data?.minAmount,
            maxAmount: response?.data.data?.maxAmount,
          });
          setIsActive(response?.data.data?.isActive);
        }
      } catch (error) {
        toast.error("Error fetching coupon data");
        console.error("Error fetching coupon:", error);
      }
    };
    fetchCoupon();
  }, [id]);
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Update Coupon</h4>
        </div>
        <div className="links">
          <Link to="/all-coupons" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="couponCode" className="form-label">
              Coupon Code
            </label>
            <input
              type="text"
              name="couponCode"
              className="form-control"
              id="couponCode"
              value={formData.couponCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="discount" className="form-label">
              Coupon Title
            </label>
            <input
              type="text"
              name="couponTitle"
              className="form-control"
              id="couponTitle"
              value={formData.couponTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="discount" className="form-label">
              Coupon Discount
            </label>
            <input
              type="number"
              name="discount"
              className="form-control"
              id="discount"
              value={formData.discount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="minAmount" className="form-label">
              Min Amount
            </label>
            <input
              type="number"
              name="minAmount"
              className="form-control"
              id="minAmount"
              value={formData.minAmount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="maxAmount" className="form-label">
              Max Amount
            </label>
            <input
              type="number"
              name="maxAmount"
              className="form-control"
              id="maxAmount"
              value={formData.maxAmount}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span>{isActive ? "Show On Home" : "Don't Show On Home"}</span>
            </label>
          </div>
          <div className="col-md-12 mt-3">
            <button
              type="submit"
              className="btn "
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Update Coupon"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCoupon;
