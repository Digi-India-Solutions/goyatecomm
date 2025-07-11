import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { fileLimit } from "../../services/fileLimit";

const EditSubSubCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    images: [],
  });

  useEffect(() => {
    fetchCategories();
    fetchSubCategory();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsCategoryLoading(true);
      const res = await axiosInstance.get("/api/v1/category/get-all-categories");
      if (res.status === 200) {
        setCategories(res.data);
      }
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const fetchSubCategory = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/subcategory/get-single-sub-category/${id}`);
      if (res.status === 200) {
        const sub = res.data;
        setFormData({
          name: sub.subCategoryName || "",
          category: sub.category?._id || "",
          images: [],
        });
        setExistingImages(sub.images || []);
      }
    } catch (err) {
      toast.error("Failed to fetch subcategory");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const selectedFiles = Array.from(files);
      const allFilesValid = selectedFiles.every((file) => fileLimit(file));
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
      const response = await axiosInstance.put(
        `/api/v1/subcategory/update-sub-category/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Sub-category updated successfully");
        navigate("/all-sub-category");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update error");
      console.error("Update SubCategory Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCategoryLoading) return <span>Loading categories...</span>;

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Sub Category</h4>
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
            <label className="form-label">Upload New Images</label>
            <input
              type="file"
              name="images"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
              multiple
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
            {existingImages.length > 0 && (
              <div className="mt-2">
                <p className="mb-1">Previously Uploaded:</p>
                <div className="d-flex flex-wrap gap-2">
                  {existingImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={`${import.meta.env.VITE_SERVER_URL}/public/image/${img}`}
                      alt={`existing-${idx}`}
                      width="80"
                      height="80"
                      style={{ objectFit: "cover" }}
                    />
                  ))}
                </div>
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
              {isLoading ? "Updating..." : "Update Sub Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditSubSubCategory;
