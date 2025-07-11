import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, {
  getData,
  postData,
} from "../../services/FetchNodeServices";
import JoditEditor from "jodit-react";
import { Autocomplete, TextField } from "@mui/material";
import { fileLimit } from "../../services/fileLimit";

const AddSubCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    status: false,
    description: "",
    collection: "",
    category: "",
    level: 0,
  });
  // const [productList, setProductList] = useState([]);
  const navigate = useNavigate();
  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/mainCategory/get-all-mainCategories"
      );
      if (response.status === 200) {
        setCategories(response?.data);
      }
    } catch (error) {
      toast.error("Error fetching categories");
      console.error("Error fetching categories:", error);
    }
  };

  const handleJoditChange = (newValue) => {
    setFormData({ ...formData, description: newValue });
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleCheckboxChange = () => {
    setFormData((prevData) => ({ ...prevData, status: !prevData.status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!fileLimit(formData?.image)) return;
    const payload = new FormData();
    payload.append("SubCategoryName", formData.name);
    payload.append("image", formData.image);
    // if (formData.collection) payload.append("levelImage", formData.collection);
    // payload.append("isActive", formData.status);
    payload.append("Parent_name", formData.category);
    // payload.append("level", formData.level);

    try {
      const response = await axiosInstance.post(
        "/api/v1/category/create-category",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success(response?.message || "Category created successfully");
        navigate("/all-category");
      } else {
        toast.error(response?.message || "Error adding category");
      }
    } catch (error) {
      toast.error(error?.response?.message || "Error adding category");
      console.error("Error adding category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Sub Category</h4>
        </div>
        <div className="links">
          <Link to="/all-category" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="image" className="form-label">
              Select Main Category
            </label>
            <select
              className="form-control"
              name="category"
              value={formData?.category}
              onChange={handleSelectChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.Parent_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="image" className="form-label">
               Category Image
            </label>
            <input
              type="file"
              name="image"
              className="form-control"
              id="image"
              accept="image/*"
              onChange={handleChange}
              required
            />
            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                width="100"
              />
            )}
          </div>

          <div className="col-md-4">
            <label htmlFor="name" className="form-label">
               Category Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* <div className="col-md-12">
            <label className="form-label">Category Details</label>
            <JoditEditor value={formData.description} onChange={handleJoditChange} />
          </div> */}

          <div className="col-md-12 mt-3">
            <button type="submit" className="btn " disabled={isLoading}>
              {isLoading ? "Saving..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSubCategory;
