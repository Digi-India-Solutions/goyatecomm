import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { fileLimit } from "../../services/fileLimit";

const AddSubSubCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryLoading, setisCategoryLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    images: [],
  });

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setisCategoryLoading(true);
      const response = await axiosInstance.get(
        "/api/v1/category/get-all-categories"
      );
     
      if (response.status === 200) {
        setCategories(response?.data);
      }
      setisCategoryLoading(false);
    } catch (error) {
      toast.error("Error fetching categories");
      console.error("Error fetching categories:", error);
      setisCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      const selectedFiles = Array.from(files);
      const allFilesValid = selectedFiles.every(file => fileLimit(file));
      if (!allFilesValid) return;

      setFormData((prev) => ({ ...prev, images: selectedFiles }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = new FormData();
    payload.append("subCategoryName", formData.name);
    payload.append("category", formData.category);
    formData.images.forEach((img) => payload.append("images", img));

    try {
      const response = await axiosInstance.post(
        "/api/v1/subcategory/create-sub-category",
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        toast.success(response?.message || "Sub-category created successfully");
        navigate("/all-sub-category");
      } else {
        toast.error(response?.message || "Error creating sub-category");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating sub-category");
      console.error("Create SubCategory Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
if(isCategoryLoading){
  return <span>Loading...</span>
}
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
            <label className="form-label">Select Category</label>
            <select
              className="form-control"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.SubCategoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Upload Sub Category Images</label>
            <input
              type="file"
              name="images"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
              multiple
              required
            />
            {formData.images.length > 0 && (
              <div className="d-flex flex-wrap mt-2 gap-2">
                {formData.images.map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt={`preview-${index}`}
                    width="80"
                    height="80"
                    style={{ objectFit: "cover" }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label">Sub Category Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-12 mt-3">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Saving..." : "Add Sub Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSubSubCategory;
