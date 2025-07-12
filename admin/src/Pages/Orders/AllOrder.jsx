import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../services/FetchNodeServices";
import "react-toastify/dist/ReactToastify.css";
import { Pagination } from "@mui/material";

const AllOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page")) || 1;

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(100);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/order/get-all-orders-admin?page=${page}&limit=${limit}`
      );
      if (res.status === 200) {
        setOrders(res.data?.orders);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to fetch orders.");
    }
  };

  const deleteOrder = async (orderId) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmation.isConfirmed) {
      try {
        const res = await axiosInstance.delete(
          `/api/v1/order/delete-order/${orderId}`
        );
        if (res.status === 200) {
          toast.success("Order deleted successfully.");
          fetchOrders();
        }
      } catch (err) {
        console.error("Delete Error:", err);
        toast.error("Failed to delete order.");
      }
    }
  };

  // Fetch orders & sync URL when page changes
  useEffect(() => {
    fetchOrders();
    navigate(`?page=${page}`, { replace: true });
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Orders</h4>
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Order ID</th>
              <th>Items</th>
              <th>Final Price</th>
              <th>Status</th>
              <th>Payment Mode</th>
              {/* <th>Payment Status</th> */}
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>
                    <Link to={`/order-details/${order._id}`}>
                      {order.orderUniqueId}
                    </Link>
                  </td>
                  <td>{order.items?.length}</td>
                  <td>₹{Math.round(order.totalAmount)}</td>
                  {/* <td>{order.orderStatus}</td> */}
                  <td>{order.paymentMethod}</td>
                  <td>{order.paymentStatus}</td>
                  <td>
                    {order.userDetails?.date
                      ? order.userDetails.date
                      : new Date(order.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                  </td>
                  <td>
                    <Link to={`/order-details/${order._id}`} className="bt edit">
                      Details <i className="fa-solid fa-eye"></i>
                    </Link>
                    &nbsp;
                    <button
                      className="bt delete"
                      onClick={() => deleteOrder(order._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Centered Pagination */}
      <div
            className="pagination-container"
            style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
          >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
          />
        </div>
      </section>
    </>
  );
};

export default AllOrder;
