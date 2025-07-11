import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, { serverURL } from "../../services/FetchNodeServices";
import { Box, Typography, Pagination, TextField } from "@mui/material";
import fallBackImage from "../../services/DBSLOGO.jpg";

const LIMIT = 100;

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromQuery = parseInt(searchParams.get("page")) || 1;

  const handleCheckboxChange = async (productId, field, checked) => {
    try {
      const response = await axiosInstance.put(
        `/api/v1/product/update-product/${productId}`,
        {
          [field]: String(checked),
        }
      );

      const updateList = (prev) =>
        prev.map((product) =>
          product._id === productId ? { ...product, [field]: checked } : product
        );

      setProducts(updateList);
      setFilteredProducts(updateList);

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error updating", field, ":", error);
    }
  };

  // Utility to strip HTML tags and return plain text
  const extractText = (htmlString) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleDelete = async (productId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosInstance.delete(
          `/api/v1/product/delete-product/${productId}`
        );
        if (res.status === 200) {
          setProducts((prev) =>
            prev.filter((product) => product._id !== productId)
          );
          setFilteredProducts((prev) =>
            prev.filter((product) => product._id !== productId)
          );
          toast.success("Product deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product!");
      }
    }
  };

  const handlePageChange = (event, value) => {
    setSearchParams({ page: value });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/api/v1/product/get-all-products?limit=${LIMIT}&page=${pageFromQuery}&createdNew=true`
        );

        const data = response?.data;
        if (data) {
          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(data.currentPage || 1);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [pageFromQuery]);

  // Handle search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        axiosInstance
          .get(`/api/v1/product/search-products?search=${search}`)
          .then((res) => {
            setFilteredProducts(res.data.products || []);
          })
          .catch((err) => console.error("Search Error:", err));
      } else {
        setFilteredProducts([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const productList = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>All Product List</h4>
        </div>
        <div className="links">
          <Link to="/add-product" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>
      {/* <div className="container my-3">
        <div className="row g-2">
          <div className="col-md-4 col-sm-6">
            <Link
              to="/upload-multiproducts-images"
              className="text-decoration-none"
            >
              <div className="card h-100 shadow-sm p-2 d-flex align-items-center flex-row gap-3">
                <i className="fa-solid fa-image text-primary fa-lg"></i>
                <div className="small fw-semibold">Upload Images</div>
              </div>
            </Link>
          </div>

          <div className="col-md-4 col-sm-6">
            <Link to="/add-product" className="text-decoration-none">
              <div className="card h-100 shadow-sm p-2 d-flex align-items-center flex-row gap-3">
                <i className="fa-solid fa-plus text-success fa-lg"></i>
                <div className="small fw-semibold">Add New</div>
              </div>
            </Link>
          </div>

          <div className="col-md-4 col-sm-6">
            <Link to="/add-multiproduct" className="text-decoration-none">
              <div className="card h-100 shadow-sm p-2 d-flex align-items-center flex-row gap-3">
                <i className="fa-solid fa-boxes-stacked text-warning fa-lg"></i>
                <div className="small fw-semibold">Add Multiple Products</div>
              </div>
            </Link>
          </div>

          <div className="col-md-4 col-sm-6">
            <Link
              to="/multiple-subcategory-to-product"
              className="text-decoration-none"
            >
              <div className="card h-100 shadow-sm p-2 d-flex align-items-center flex-row gap-3">
                <i className="fa-solid fa-layer-group text-info fa-lg"></i>
                <div className="small fw-semibold">
                  Multiple Product's Subcategory
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4 col-sm-6">
            <Link
              to="/update-product-currency"
              className="text-decoration-none"
            >
              <div className="card h-100 shadow-sm p-2 d-flex align-items-center flex-row gap-3">
                <i className="fa-solid fa-dollar-sign text-danger fa-lg "></i>
                <div className="small fw-semibold">Update Currency Rate</div>
              </div>
            </Link>
          </div>

          <div className="col-md-4 col-sm-6">
            <Link to="/update-products-stock" className="text-decoration-none">
              <div className="card h-100 shadow-sm p-2 d-flex align-items-center flex-row gap-3">
                <i className="fa-solid fa-box text-secondary fa-lg"></i>
                <div className="small fw-semibold">Update Stocks</div>
              </div>
            </Link>
          </div>
        </div>
      </div> */}

      <Box mb={2} mt={2}>
        {/* <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          🔼 Please upload images first before uploading multiple products.
        </Typography> */}
        <Typography variant="body2" gutterBottom>
          Page {currentPage} of {totalPages} | Products on this page:{" "}
          {products.length}
        </Typography>

        <TextField
          label="Search Products"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product name, ISBN or author"
        />
      </Box>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>S No.</th>
              <th>Title</th>
              <th>Image</th>
              <th>Details</th>
              <th>Unit</th>
              <th>New Arrival</th>
              <th>Featured</th>
              <th>Best Selling</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Final Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="12" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : search.trim() && filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center">
                  No matching products found.
                </td>
              </tr>
            ) : (
              productList.map((product, index) => (
                <tr key={product._id}>
                  <td>{(currentPage - 1) * LIMIT + index + 1}</td>
                  <td>
                    {product?.title?.length > 20
                      ? product.title.slice(0, 20) + "..."
                      : product.title}
                  </td>
                  <td>
                    <img
                      src={
                        product?.images?.[0]
                          ? `${serverURL}/public/image/${product.images[0]}`
                          : fallBackImage
                      }
                      alt={
                        product?.title?.length > 20
                          ? product.title.slice(0, 20) + "..."
                          : product.title
                      }
                      style={{ width: "60px", height: "auto" }}
                    />
                  </td>
                  <td>
                    <p className="text-sm text-gray-700">
                      {product?.details
                        ? extractText(product.details).length > 20
                          ? extractText(product.details).slice(0, 20) + "..."
                          : extractText(product.details)
                        : "N/A"}
                    </p>
                  </td>
                  <td>{product?.pages}</td>
                  <td>
                    <input
                      type="checkbox"
                      name="newArrival"
                      checked={product?.newArrival}
                      onChange={(e) =>
                        handleCheckboxChange(
                          product._id,
                          e.target.name,
                          e.target.checked
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      name="featuredBooks"
                      checked={product?.featuredBooks}
                      onChange={(e) =>
                        handleCheckboxChange(
                          product._id,
                          e.target.name,
                          e.target.checked
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      name="bestSellingBooks"
                      checked={product?.bestSellingBooks}
                      onChange={(e) =>
                        handleCheckboxChange(
                          product._id,
                          e.target.name,
                          e.target.checked
                        )
                      }
                    />
                  </td>
                  <td>{product?.price}</td>
                  <td>
                    {product?.discount || "-"}
                    {product?.discount > 100 ? " ₹" : "%"}
                  </td>
                  <td>{product?.finalPrice?.toFixed(2)}</td>
                  <td>
                    <Link
                      to={`/edit-product/${product._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                    &nbsp;
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bt delete"
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div
            className="pagination-container"
            style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </div>
        )}
      </section>
    </>
  );
};

export default AllProduct;
