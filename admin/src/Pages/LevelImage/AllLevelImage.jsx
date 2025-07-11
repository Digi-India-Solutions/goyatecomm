import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, { serverURL } from "../../services/FetchNodeServices";

const AllLevelImages = () => {
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all levels on mount
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/v1/level/get-all-levels"
        );
        if (response.status === 200) {
          setLevels(response.data?.reverse());
        }
      } catch (error) {
        toast.error("Error fetching level data");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLevels();
  }, []);

  // Handle Delete
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
        const res = await axiosInstance.delete(
          `/api/v1/level/delete-level/${id}`
        );
        if (res.status === 200) {
          setLevels((prev) => prev.filter((item) => item._id !== id));
          Swal.fire("Deleted!", "Level image has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
        console.error("Delete error:", error);
      }
    }
  };

  // Handle isActive toggle
  const handleIsActiveChange = async (e, id) => {
    const updatedStatus = e.target.checked;
    try {
      const res = await axiosInstance.put(`/api/v1/level/update-level/${id}`, {
        isActive: String(updatedStatus),
      });
      if (res.status === 200) {
        const updated = levels.map((item) =>
          item._id === id ? { ...item, isActive: updatedStatus } : item
        );
        setLevels(updated);
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Update error:", error);
    }
  };

  if (isLoading) return <p>Loading levels...</p>;

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Level Images</h4>
        </div>
        <div className="links">
          <Link to="/add-level-image" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Level Image</th>
              <th scope="col">Category</th>
              <th scope="col">Level</th>
              <th scope="col">Active</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {levels?.length > 0 ? (
              levels
                .sort((a, b) => a.level - b.level)
                .map((level, index) => (
                  <tr key={level._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={`${serverURL}/public/image/${level?.levelImage}`}
                        alt="Level"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </td>

                    <td>{level?.category?.SubCategoryName}</td>
                    <td>{level?.level}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={level?.isActive}
                        onChange={(e) => handleIsActiveChange(e, level._id)}
                      />
                    </td>
                    <td>
                      <Link
                        to={`/edit-level-image/${level._id}`}
                        className="bt edit"
                      >
                        Edit <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                    </td>
                    <td>
                      <button
                        className="bt delete"
                        onClick={() => handleDelete(level._id)}
                      >
                        Delete <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No levels found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllLevelImages;
