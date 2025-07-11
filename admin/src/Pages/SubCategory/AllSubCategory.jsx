import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, {
  getData,
  postData,
  serverURL,
} from "../../services/FetchNodeServices";

const AllSubCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/v1/subcategory/get-all-sub-categories"
        );
      
        if (response) {
          setCategories(response.data?.reverse());
        }
      } catch (error) {
        toast.error("Error fetching categories");
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle Delete Action
  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const data = await axiosInstance.delete(
          `/api/v1/subcategory/delete-sub-category/${id}`
        );

        if (data.status === 200) {
          setCategories(categories.filter((category) => category._id !== id));
          Swal.fire("Deleted!", "Your category has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was an error deleting the category.",
          "error"
        );
        console.error("Error deleting category:", error);
      }
    }
  };

  // Handle Category Status Change
  const handleCheckboxChange = async (e, categoryId) => {
    console.log("categoryId", categoryId);

    const updatedStatus = e.target.checked;

    try {
      const response = await axiosInstance.put(
        `/api/v1/sub-category/update-sub-category/${categoryId}`,
        {
          isCollection: updatedStatus,
        }
      );

      if (response.status === 200) {
        const updatedCategories = categories.map((category) => {
          if (category._id === categoryId) {
            category.isCollection = updatedStatus;
          }
          return category;
        });
        setCategories(updatedCategories);
      }
    } catch (error) {
      toast.error("Error updating category status");
      console.error("Error updating category status:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return <p>Loading sub categories...</p>;
  }

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Sub Category</h4>
        </div>
        <div className="links">
          <Link to="/add-sub-category" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
          {/* <Link
            to="/multiple-subcategory"
            className="add-new"
            style={{ marginLeft: "10px" }}
          >
            Multiple Sub Category <i className="fa-solid fa-plus"></i>
          </Link> */}
        </div>
      </div>

      {/* <div className="filteration">
                <div className="head">
                NOTE :- Do add only upto 5 diseases
                </div>
                <div className="search">
                  
                </div>
            </div> */}

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Sub Category Name</th>
              <th scope="col">Category</th>
              <th scope="col">Image</th>
              {/* <th scope="col">Show in Collection</th> */}
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {categories?.length > 0 ? (
              categories?.map((category, index) => (
                <tr key={category._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{category?.subCategoryName?.length>20?category?.subCategoryName?.slice(0,20)+"...":category?.subCategoryName}</td>
                  <td>{category?.category?.SubCategoryName || "N/A"}</td>
                  <td>
                    <img
                      src={`${serverURL}/public/image/${category?.categoryImage}`}
                      alt={category?.subCategoryName?.length>20?category?.subCategoryName?.slice(0,20)+"...":category?.subCategoryName}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  {/* <td>
                                        <input
                                            type="checkbox"
                                            checked={category?.isCollection}
                                            onChange={(e) => handleCheckboxChange(e, category._id)}
                                        />
                                    </td> */}
                  <td>
                    <Link
                      to={`/edit-sub-category/${category?._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="bt delete"
                      title="Delete"
                      onClick={() => handleDelete(category._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No sub categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllSubCategory;
