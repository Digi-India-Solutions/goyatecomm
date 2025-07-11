// ... All imports same
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import JoditEditor from "jodit-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { fileLimit } from "../../services/fileLimit";
import "./product.css";

const EditProduct = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    images: [],
    mainCategory: "",
    category: "",
    price: 0,
    discount: 0,
    finalPrice: 0,
    description: "",
    details: "",
    newArrival: false,
    featuredBooks: false,
    bestSellingBooks: false,
    author: "",
    pages: "",
    ISBN: "",
    publisher: "",
    publicationDate: "",
    language: "",
  });

  useEffect(() => {
    fetchMainCategory();
    fetchAllSubcategories();
    if (productId) fetchProductDetails(productId);
  }, [productId]);

  const fetchMainCategory = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/mainCategory/get-all-mainCategories");
      setCategoryList(res?.data || []);
    } catch (err) {
      toast.error("Failed to fetch main categories.");
    }
  };

  const fetchAllSubcategories = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/category/get-all-categories");
      setSubcategoryList(res?.data || []);
    } catch (err) {
      toast.error("Failed to fetch subcategories.");
    }
  };

 const fetchProductDetails = async (id) => {
  try {
    const res = await axiosInstance.get(`/api/v1/product/get-product/${id}`);
    const product = res?.data?.product;
    if (product) {
      setFormData({
        ...product,
        mainCategory: product?.mainCategory|| "",
        category: product?.category._id || "",
      });
    }
  } catch (err) {
    toast.error("Failed to load product.");
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "images") {
      setFormData((prev) => ({ ...prev, images: [...files] }));
    }
  };

  const handleJoditChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleJoditDetailsChange = (value) => {
    setFormData((prev) => ({ ...prev, details: value }));
  };

  useEffect(() => {
    const total = parseFloat(formData.price * (1 - formData.discount / 100)).toFixed(2);
    setFormData((prev) => ({ ...prev, finalPrice: total }));
  }, [formData.price, formData.discount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.category) return toast.error("Subcategory is required");
    if (!fileLimit(formData?.coverImage)) return;

    if (formData.images && Array.isArray(formData.images)) {
      for (const image of formData.images) {
        if (!fileLimit(image)) {
          setIsLoading(false);
          return;
        }
      }
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => payload.append(key, item));
      } else {
        payload.append(key, value);
      }
    });

    try {
      const response = await axiosInstance.put(`/api/v1/product/update-product/${productId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        toast.success("Product updated successfully");
        navigate("/all-products");
      }
    } catch (err) {
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Product</h4>
        </div>
        <div className="links">
          <Link to="/all-products" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3 mt-2" onSubmit={handleSubmit}>
          <div className="col-md-3">
            <label className="form-label">Product Name*</label>
            <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="col-md-3">
            <label className="form-label">Unit*</label>
            <input type="text" name="pages" className="form-control" value={formData.pages} onChange={handleChange} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Select Category</label>
            <select name="mainCategory" required className="form-select" onChange={handleChange} value={formData.mainCategory}>
              <option value="">Select Category</option>
              {categoryList.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat?.Parent_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Select Sub Category</label>
            <select
              name="category"
              required
              className="form-select"
              onChange={handleChange}
              value={formData.category}
            >
              <option value="">Select Sub Category</option>
              {subcategoryList
                .filter((cat) => cat?.Parent_name?._id === formData.mainCategory)
                .map((subcat) => (
                  <option key={subcat._id} value={subcat._id}>
                    {subcat.SubCategoryName}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Images</label>
            <input type="file" multiple name="images" className="form-control" onChange={handleFileChange} />
          </div>

          <div className="col-md-12">
            <label className="form-label">Product Description*</label>
            <JoditEditor value={formData.description} onChange={handleJoditChange} />
          </div>

          <div className="col-md-12">
            <label className="form-label">Product Details*</label>
            <JoditEditor value={formData.details} onChange={handleJoditDetailsChange} />
          </div>

          <div className="row">
            <div className="col-md-2">
              <label className="form-label">Price*</label>
              <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required />
            </div>

            <div className="col-md-2">
              <label className="form-label">Discount %*</label>
              <input
                type="number"
                name="discount"
                className="form-control"
                value={formData.discount}
                onChange={handleChange}
                min={0}
                max={100}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Final Price*</label>
              <input type="number" name="finalPrice" className="form-control" value={formData.finalPrice} readOnly />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-4">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="newArrival" name="newArrival" checked={formData.newArrival} onChange={handleChange} />
                <label className="form-check-label" htmlFor="newArrival">New Arrival</label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="featuredBooks" name="featuredBooks" checked={formData.featuredBooks} onChange={handleChange} />
                <label className="form-check-label" htmlFor="featuredBooks">Featured Product</label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="bestSellingBooks" name="bestSellingBooks" checked={formData.bestSellingBooks} onChange={handleChange} />
                <label className="form-check-label" htmlFor="bestSellingBooks">Best Selling</label>
              </div>
            </div>
          </div>

          <div className="col-md-12 mt-4 text-center">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
