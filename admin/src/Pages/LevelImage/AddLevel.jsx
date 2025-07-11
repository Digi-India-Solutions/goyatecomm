import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { fileLimit } from "../../services/fileLimit";
import Select from "react-select";

const AddLevel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [formData, setFormData] = useState({
    mainCategory: "",
    level: "",
    levelImage: null,
    isActive: false, // ✅ Added
  });

  const navigate = useNavigate();

  const fetchMainCategories = async () => {
    try {
      setCategoryLoading(true);
      const response = await axiosInstance.get(
        "/api/v1/category/get-all-categories"
      );
      if (response.status === 200) {
        setMainCategories(response.data);
      }
      setCategoryLoading(false);
    } catch (error) {
      setCategoryLoading(false);
      toast.error("Error fetching main categories");
      console.error("Main category fetch error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.mainCategory || !formData.levelImage) {
      toast.error("Please select category and upload level image");
      setIsLoading(false);
      return;
    }

    if (!fileLimit(formData.levelImage)) {
      setIsLoading(false);
      return;
    }

    const payload = new FormData();
    payload.append("category", formData.mainCategory);
    payload.append("level", formData.level || 0);
    payload.append("levelImage", formData.levelImage);
    payload.append("isActive", formData.isActive); // ✅ Added

    try {
      const response = await axiosInstance.post(
        "/api/v1/level/create-level",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Level created successfully");
        navigate("/all-level-images"); // ✅ Updated redirect
      } else {
        toast.error(response?.message || "Error creating level");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating level");
      console.error("Create Level Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMainCategories();
  }, []);

  if (categoryLoading) {
    return <span>Loading...</span>;
  }
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Level</h4>
        </div>
        <div className="links">
          <Link to="/all-level-images" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="mainCategory" className="form-label">
              Select Category
            </label>
            <Select
              name="mainCategory"
              value={
                mainCategories
                  .map((cat) => ({
                    value: cat._id,
                    label: cat.SubCategoryName,
                  }))
                  .find((option) => option.value === formData.mainCategory) ||
                null
              }
              onChange={(selectedOption) =>
                setFormData((prev) => ({
                  ...prev,
                  mainCategory: selectedOption ? selectedOption.value : "",
                }))
              }
              options={mainCategories.map((cat) => ({
                value: cat._id,
                label: cat.SubCategoryName,
              }))}
              placeholder="Select Category"
              isSearchable
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="level" className="form-label">
              Level (1–3)
            </label>
            <select
              className="form-select"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="">Select Level</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="levelImage" className="form-label">
              Upload Level Image
            </label>
            <input
              type="file"
              name="levelImage"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
              required
            />
            {formData.levelImage && (
              <img
                src={URL.createObjectURL(formData.levelImage)}
                alt="Preview"
                width="100"
                className="mt-2"
              />
            )}
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isActive">
                Active
              </label>
            </div>
          </div>

          <div className="col-md-12 mt-3">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Saving..." : "Add Level"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddLevel;
