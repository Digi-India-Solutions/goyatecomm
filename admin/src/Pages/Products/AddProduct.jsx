import axios from "axios";
import JoditEditor from "jodit-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, {
  getData,
  postData,
} from "../../services/FetchNodeServices.js";
import { Autocomplete, TextField } from "@mui/material";
import "./product.css";
import { fileLimit } from "../../services/fileLimit.js";
const AddProduct = () => {
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
    // stock: 0,
    finalPrice: 0,
    description: "",
    newArrival: "",
    featuredBooks: "",
    bestSellingBooks: "",
    author: "",
    pages: "",
    ISBN: "",
    publisher: "",
    publicationDate: "",
    language: "",
    details: "",
  });

  const navigate = useNavigate();

  const fetchSubCategory = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/category/get-all-categories"
      );
      if (response?.status === 200) {
        console.log("sub category response", response.data);

        setSubcategoryList(response.data);
      }
    } catch (error) {
      toast.error(
        error.response
          ? error.response.data.message
          : "Error fetching Category data"
      );
    }
  };
  const fetchCategory = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/mainCategory/get-all-mainCategories"
      );
      if (response?.status === 200) {
        setCategoryList(response.data);
      }
    } catch (error) {
      toast.error(
        error.response
          ? error.response.data.message
          : "Error fetching Category data"
      );
    }
  };

  useEffect(() => {
    fetchSubCategory();
    fetchCategory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubCategoryChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    try {
      const res = await axiosInstance.get(
        `/api/v1/category/get-subcategories-by-category/${value}`
      );
      console.log("res", res.data.data);

      setSubcategoryList(res?.data?.data);
    } catch (error) {
      console.log("fetching subcategory error", error);
      toast.error("Error fetching subcategory data");
    }
  };
  const handleJoditChange = (newValue) => {
    setFormData((prev) => ({ ...prev, description: newValue }));
  };
  const handleJoditDetailsChange = (newValue) => {
    setFormData((prev) => ({ ...prev, details: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.category) {
      toast.error("category is required");
      return;
    }
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
        value.forEach((item) => {
          payload.append(key, item);
        });
      } else {
        payload.append(key, value);
      }
    });
    try {
      const response = await axiosInstance.post(
        "/api/v1/product/create-product",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success("product created success");
        navigate("/all-products");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to add product. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: [...Array.from(files)],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  useEffect(() => {
    let total = parseFloat(
      formData.price * (1 - formData.discount / 100)
    ).toFixed(2);
    setFormData((prev) => ({ ...prev, finalPrice: total }));
  }, [formData.price, formData.discount]);
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Product</h4>
        </div>
        <div className="links">
          <Link to="/all-products" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3 mt-2" onSubmit={handleSubmit}>
          {/* <div className="col-md-3">
            <label className="form-label">Product Image*</label>
            <input type="file" className="form-control" multiple onChange={handleFileChange} required />
          </div> */}

          <div className="col-md-3">
            <label className="form-label">Product Name*</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* <div className="col-md-3">
            <label className="form-label">Key Features*</label>
            <input
              type="text"
              name="author"
              className="form-control"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div> */}

          <div className="col-md-3">
            <label className="form-label">Unit*</label>
            <input
              type="text"
              name="pages"
              className="form-control"
              value={formData.pages}
              onChange={handleChange}
              required
            />
          </div>
{/* 
          <div className="col-md-3">
            <label className="form-label">Brand*</label>
            <input
              type="text"
              name="ISBN"
              className="form-control"
              value={formData.ISBN}
              onChange={handleChange}
              required
            />
          </div> */}

          <div className="row mt-4">
            <div className="col-md-6">
              <label className="form-label">Select Category</label>
              <select
                name="mainCategory"
                required
                className="form-select"
                onChange={handleChange}
                value={formData.mainCategory}
              >
                <option value="">Select Category</option>
                {categoryList?.map((category) => (
                  <option key={category?._id} value={category?._id}>
                    {category?.Parent_name}
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
                {subcategoryList?.filter((category) => category.Parent_name._id === formData.mainCategory)?.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory?.SubCategoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* <div className="col-md-3">
            <label className="form-label">Expiry Date*</label>
            <input
              type="text"
              name="publisher"
              className="form-control"
              value={formData.publisher}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Manufacturer*</label>
            <input
              type="text"
              name="publicationDate"
              className="form-control"
              value={formData.publicationDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Country of Origin*</label>
            <input
              type="text"
              name="language"
              className="form-control"
              list="doorOptions"
              value={formData.language}
              onChange={handleChange}
              required
            />
            <datalist id="doorOptions">
              <option value="Single Door" />
              <option value="Sliding brand" />
              <option value="Mirror Door" />
              <option value="Sliding Mirror Door" />
              <option value="Double Door" />
              <option value="Triple Door" />
              <option value="Four Door" />
            </datalist>
          </div> */}

          {/* <div className="col-md-3">
            <label className="form-label">Select Type</label>
            <Autocomplete
              multiple
              options={typeOptions}

              value={typeOptions.filter((opt) => formData.type.includes(opt.name))}
              onChange={(e, newValue) => setFormData((prev) => ({ ...prev, type: newValue.map((opt) => opt.name), }))
              }
              getOptionLabel={(option) => option.name}
              // value={typeOptions.find((opt) => opt.name === formData.type) || null}
              // onChange={(e, value) => setFormData({ ...formData, type: value?.name || "" })}
              renderInput={(params) => <TextField {...params} label="Select Type" />}
            />
          </div> */}

          <div className="col-md-3">
            <label className="form-label">Images</label>
            <input
              type="file"
              multiple
              name="images"
              className="form-control"
              onChange={handleFileChange}
              maxLength={4}
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Product Description*</label>
            <JoditEditor
              value={formData.description}
              onChange={handleJoditChange}
            />
          </div>
          <div className="col-md-12">
            <label className="form-label">Product Details*</label>
            <JoditEditor
              value={formData.details}
              onChange={handleJoditDetailsChange}
            />
          </div>

          <div className="row">
            <div className="col-md-2">
              <label className="form-label">Price*</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                required
              />
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
              <input
                type="number"
                name="finalPrice"
                className="form-control"
                value={formData.finalPrice}
                readOnly
              />
            </div>

            {/* <div className="col-md-2">
              <label className="form-label">Stock</label>
              <input
                type="text"
                name="stock"
                className="form-control"
                value={formData.stock}
                onChange={handleChange}
              />
            </div> */}
          </div>
          {/* <div className="row" style={{ marginTop: "20px" }}>
            <div className="col-md-3">
              <label className="form-label">Specifications*</label>
              <input
                type="text"
                name="Specifications"
                className="form-control"
                value={formData.Specifications}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">BrandCollectionOverview*</label>
              <input
                type="text"
                name="BrandCollectionOverview"
                className="form-control"
                value={formData.BrandCollectionOverview}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">CareMaintenance*</label>
              <input
                type="text"
                name="CareMaintenance"
                className="form-control"
                value={formData.CareMaintenance}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">seller*</label>
              <input
                type="text"
                name="seller"
                className="form-control"
                value={formData.seller}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Warranty*</label>
              <input
                type="text"
                name="Warranty"
                className="form-control"
                value={formData.Warranty}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-12" style={{ marginTop: "20px" }}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="status"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor="status">
                Featured Product
              </label>
            </div>
          </div> */}
          <div className="row mt-3">
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="newArrival"
                  checked={formData.newArrival === "true"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newArrival: e.target.checked.toString(),
                    })
                  }
                />
                <label className="form-check-label" htmlFor="newArrival">
                  New Arrival
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="featuredBooks"
                  checked={formData.featuredBooks === "true"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      featuredBooks: e.target.checked.toString(),
                    })
                  }
                />
                <label className="form-check-label" htmlFor="featuredBooks">
                  Featured Products
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="bestSellingBooks"
                  checked={formData.bestSellingBooks === "true"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bestSellingBooks: e.target.checked.toString(),
                    })
                  }
                />
                <label className="form-check-label" htmlFor="bestSellingBooks">
                  Best Selling Products
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-12 mt-4 text-center">
            <button type="submit" className="btn " disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
