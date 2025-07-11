import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, { serverURL } from "../../services/FetchNodeServices";
import { fileLimit } from "../../services/fileLimit";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    oldImage: "",
  });

  const [btnLoading, setBtnLoading] = useState(false);


  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/mainCategory/get-single-mainCategory/${id}`
        );

        if (response?.status === 200) {
          setFormData({
            name: response?.data?.Parent_name || "",
            image: null,
            oldImage: response?.data?.mainCategoryImage || "",
          });
        }
      } catch (error) {
        toast.error("Error fetching category data");
        console.error("Fetch category error:", error);
      }
    };

    fetchCategory();
  }, [id]);

  
  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      if (!fileLimit(files[0])) return;
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const payload = new FormData();
      payload.append("Parent_name", formData.name);
      if (formData.image) {
        payload.append("image", formData.image);
      }

      const response = await axiosInstance.put(
        `/api/v1/mainCategory/update-mainCategory/${id}`,
        payload,{
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(response?.data?.message || "Category updated successfully");
        navigate("/all-maincategory");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating category");
      console.error("Update category error:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Category</h4>
        </div>
        <div className="links">
          <Link to="/all-maincategory" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Category Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
            />
            {formData.oldImage && !formData.image && (
              <img
                src={`${serverURL}/${formData.oldImage}`}
                alt="Current"
                width="100"
                style={{ marginTop: "10px" }}
              />
            )}
            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="New Preview"
                width="100"
                style={{ marginTop: "10px" }}
              />
            )}
          </div>

          <div className="col-12 text-center">
            <button type="submit" className="btn" disabled={btnLoading}>
              {btnLoading ? "Please Wait..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCategory;
