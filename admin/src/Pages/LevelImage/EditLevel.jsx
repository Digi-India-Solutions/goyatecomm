import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, { serverURL } from "../../services/FetchNodeServices";
import { fileLimit } from "../../services/fileLimit";
import Select from "react-select";

const EditLevel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mainCategories, setMainCategories] = useState([]);
    const [categoryLoading, setCategoryLoading] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [formData, setFormData] = useState({
    mainCategory: "",
    level: "",
    levelImage: null,
    isActive: false,
  });

  // Fetch existing level data
  const fetchLevel = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/level/get-single-level/${id}`
      );
      if (response.status === 200) {
        const level = response.data;
        setFormData({
          mainCategory: level.category?._id || "",
          level: level.level?.toString() || "",
          levelImage: null,
          isActive: level.isActive,
        });
        setPreviewImage(level.levelImage);
      }
    } catch (error) {
      toast.error("Error fetching level data");
      console.error("Level fetch error:", error);
    }
  };

  // Fetch main categories
  const fetchMainCategories = async () => {
    try {
      setCategoryLoading(true)

      const response = await axiosInstance.get(
               "/api/v1/category/get-all-categories"

      );
      if (response.status === 200) {
        setMainCategories(response.data);
      }
      setCategoryLoading(false)

    } catch (error) {
      setCategoryLoading(false)

      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchMainCategories();
    fetchLevel();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewImage(files[0]);
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = new FormData();
    payload.append("category", formData.mainCategory);
    payload.append("level", formData.level || 0);
    payload.append("isActive", formData.isActive);
    if (formData.levelImage) {
      if (!fileLimit(formData.levelImage)) {
        setIsLoading(false);
        return;
      }
      payload.append("levelImage", formData.levelImage);
    }

    try {
      const response = await axiosInstance.put(
        `/api/v1/level/update-level/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Level updated successfully");
        navigate("/all-level-images");
      } else {
        toast.error(response?.message || "Error updating level");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating level");
      console.error("Update Level Error:", error);
    } finally {
      setIsLoading(false);
    }
  };


    if(categoryLoading){
    return <span>Loading...</span>
  }
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Level</h4>
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
        .map((cat) => ({ value: cat._id, label: cat.SubCategoryName }))
        .find((option) => option.value === formData.mainCategory) || null
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
            <label className="form-label">Level (1–3)</label>
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
            <label className="form-label">Upload New Level Image</label>
            <input
              type="file"
              name="levelImage"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
            />
            {previewImage && (
              <img
                src={
                  previewImage instanceof File
                    ? URL.createObjectURL(previewImage)
                    : `${serverURL}/public/image/${previewImage}`
                }
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
              {isLoading ? "Updating..." : "Update Level"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditLevel;
