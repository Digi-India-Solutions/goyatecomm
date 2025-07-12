import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, {
  getData,
  postData,
  serverURL,
} from "../../services/FetchNodeServices";
import "react-toastify/dist/ReactToastify.css";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#333",
    lineHeight: 1.6,
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#1A237E",
  },
  sectionTitle: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 8,
    textDecoration: "underline",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 4,
  },
  table: {
    display: "table",
    width: "100%",
    marginTop: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCol: {
    borderRight: "1px solid #ccc",
    borderBottom: "1px solid #ccc",
    padding: 6,
    textAlign: "left",
  },
  col1: { width: "40%" },
  col2: { width: "20%" },
  col3: { width: "20%" },
  col4: { width: "20%", borderRight: "none" },
  summary: {
    marginTop: 20,
    fontSize: 12,
  },
  bold: {
    fontWeight: "bold",
    marginTop: 4,
  },
  footer: {
    marginTop: 40,
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
});

const InvoicePDF = ({ order }) => {
  const items = order.items || [];
  const userName =
    order.userDetails?.name ||
    order.shippingAddress?.firstName + " " + order.shippingAddress?.lastName;
  const orderDate =
    order.userDetails?.date ||
    new Date(order.createdAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Goyat Trading Co.</Text>

        <Text style={styles.sectionTitle}>Order Summary</Text>
        <Text style={styles.section}>Order ID: {order._id}</Text>
        <Text style={styles.section}>Unique ID: {order.orderUniqueId}</Text>
        <Text style={styles.section}>Customer: {userName}</Text>
        {order?.userDetails?.upiId && (
          <Text style={styles.section}>
            UPI ID: {order?.userDetails?.upiId}
          </Text>
        )}
        <Text style={styles.section}>Order Date: {orderDate}</Text>
        <Text style={styles.section}>
          Payment Status: {order.paymentStatus}
        </Text>
        <Text style={styles.section}>
          Payment Method: {order.paymentMethod}
        </Text>
        <Text style={styles.section}>Order Status: {order.orderStatus}</Text>

        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCol, styles.col1]}>Product</Text>
            <Text style={[styles.tableCol, styles.col2]}>Qty</Text>
            <Text style={[styles.tableCol, styles.col3]}>Price (Rs.)</Text>
            <Text style={[styles.tableCol, styles.col4]}>Total (Rs.)</Text>
          </View>

          {/* Table Rows */}
          {items.map((item, idx) => {
            const product = item.productId || {};
            const price = product.finalPrice || 0;
            const total = price * item.quantity;
            return (
              <View style={styles.tableRow} key={idx}>
                <Text style={[styles.tableCol, styles.col1]}>
                  {product.title}
                </Text>
                <Text style={[styles.tableCol, styles.col2]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCol, styles.col3]}>
                  Rs.{price.toFixed(2)}
                </Text>
                <Text style={[styles.tableCol, styles.col4]}>
                  Rs.{total.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Summary Section */}
        <View style={styles.summary}>
                   <Text>Shipping Cost: {order.shippingCost === 0 ? "Free" : `Rs. ${order.shippingCost}`}</Text>
         
          <Text style={styles.bold}>Total Amount: Rs.{order.totalAmount}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for shopping with Goyat Trading Co.
        </Text>
      </Page>
    </Document>
  );
};

const EditOrder = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState({});
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch API data
  const getApiData = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/order/get-order-by-id/${id}`
      );
      if (res?.status === 200) {
        setOrderData(res?.data?.order);
        setOrderStatus(res?.data?.order?.orderStatus);
        setPaymentStatus(res?.data?.order?.paymentStatus);
      }
    } catch (error) {
      console?.error("Error fetching order data:", error);
      toast?.error("Failed to fetch order data.");
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  const handleChangeStatus = async (e, title) => {
    const value = e?.target?.value || e;
    if (title) {
      title === "paymant" ? setPaymentStatus(value) : setOrderStatus(value);
    }
  };

  const isOrderStatusDisabled =
    orderStatus === "Delivered" || orderStatus === "Cancelled";
  const isPaymentStatusDisabled = paymentStatus === "Success";
  //   const handleLogin2 = () => {
  //     setStep(2);
  //     setLoading(false);
  //   };
  const handleLogin2 = async () => {
    const loading = toast.loading("Please wait...");
    try {
      const res = await axiosInstance.put(`/api/v1/order/update-order/${id}`, {
        orderStatus,
        paymentStatus,
      });
      if (res?.status === 200) {
        toast.dismiss(loading);
        toast?.success("Order updated successfully!");
        setTimeout(() => {
          navigate("/all-orders");
        }, 1000);
      }
    } catch (error) {
      toast.dismiss(loading);
      console?.error("Error updating order:", error);
      toast?.error("Failed to update order.");
    }
  };

  const handleLogin = async (e) => {
    setStep(2);
    e.preventDefault();
    setLoading(true);

    const payload = { email, password };

    try {
      const response = await postData(
        "api/shiprocket/login-via-shiprocket",
        payload
      );
      console.log(response);
      if (response.success === true) {
        localStorage.setItem("shiprocketToken", response.data.token);
        setToken(response?.data?.token);
        toast.success("Login successful!");
        setStep(3);
      }
    } catch (error) {
      console?.log(error);
      toast.error("Login failed! Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postData(
        "api/shiprocket/shiped-order-shiprocket",
        { ...orderData, token }
      );

      console.log(response);
      if (response?.success === true) {
        toast.success(
          "Order successfully submitted to ShipRocket and status updated to Shipped!"
        );
        setStep(1);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  return (
    <>
      <div className="bread">
        <div className="head">
          {step === 1 ? (
            <h4>Update Order</h4>
          ) : step === 2 ? (
            <h4>Login Ship Rocket</h4>
          ) : (
            <h4>Create Order</h4>
          )}
        </div>
        <div className="links">
          <Link to="/all-orders" className="btn btn-outline-secondary">
            Back <i className="fa fa-arrow-left"></i>
          </Link>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          {step === 1 && (
            <>
              {" "}
              <div className="col-lg-8">
                <div className="card shadow-lg">
                  <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Order Details</h5>
                    <div>
                      <PDFDownloadLink
                        document={<InvoicePDF order={orderData} />}
                        fileName={`Invoice_ ${orderData?.orderUniqueId}.pdf`}
                      >
                        {({ loading }) =>
                          loading ? (
                            <button className="btn btn-secondary">
                              Loading...
                            </button>
                          ) : (
                            <button className="btn btn-primary">
                              Download Invoice
                            </button>
                          )
                        }
                      </PDFDownloadLink>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <th scope="row">Order ID</th>
                          <td>{orderData?._id}</td>
                        </tr>
                        <tr>
                          <th scope="row">Order Unique ID</th>
                          <td>{orderData?.orderUniqueId}</td>
                        </tr>
                        <tr>
                          <th scope="row">User Name</th>
                          <td>
                            {orderData.userDetails ? (
                              orderData.userDetails?.name
                            ) : (
                              <>
                                {orderData?.shippingAddress?.firstName}{" "}
                                {orderData?.shippingAddress?.lastName}{" "}
                              </>
                            )}
                          </td>
                        </tr>
                        {/* <tr>
                          <th scope="row">Email</th>
                          <td>
                            {orderData?.userDetails
                              ? orderData?.userDetails?.email
                              : orderData?.shippingAddress?.email}
                          </td>
                        </tr> */}
                        {/* <tr>
                          <th scope="row">Phone Number</th>
                          <td>{orderData?.shippingAddress?.phone}</td>
                        </tr> */}
                        {/* <tr>
                          <th scope="row">Address</th>
                          <td>
                            {orderData?.shippingAddress?.address},{" "}
                            {orderData?.shippingAddress?.city},{" "}
                            {orderData?.shippingAddress?.state},{" "}
                            {orderData?.shippingAddress?.postalCode} ,
                            {orderData?.shippingAddress?.country}
                          </td>
                        </tr> */}
                        <tr>
                          <th scope="row">Order Date</th>
                          <td>
                            {orderData?.userDetails
                              ? orderData?.userDetails?.date
                              : new Date(orderData?.createdAt).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Final Price</th>
                          <td>₹{Math.round(orderData?.totalAmount)}</td>
                        </tr>
                        <tr>
                          <th scope="row">Order Status</th>
                          <td>
                            <select
                              className="form-select"
                              value={orderStatus}
                              onChange={(e) => handleChangeStatus(e, "order")}
                              disabled={isOrderStatusDisabled}
                            >
                              <option value="Placed">Order Placed</option>
                              <option value="Confirmed">Order Confirmed</option>
                              <option value="Shipped">Order Shipped</option>
                              <option value="Delivered">Order Delivered</option>
                              <option value="Cancelled">Order Cancelled</option>
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Payment Mode</th>
                          <td>{orderData?.paymentMethod}</td>
                        </tr>
                        {/* <tr>
                          <th scope="row">Payment Id</th>
                          <td>{orderData?.paymentInfo?.paymentId || "-"}</td>
                        </tr> */}
                        <tr>
                          <th scope="row">Payment Status</th>
                          <td>
                            <select
                              className="form-select"
                              value={paymentStatus}
                              // onChange={(e) => setPaymentStatus(e.target.value)}
                              onChange={(e) =>
                                handleChangeStatus(e.target.value, "paymant")
                              }
                              disabled={isPaymentStatusDisabled}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                              <option value="Failed">Failed</option>
                            </select>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-4"
                style={{ overflowY: "scroll", height: "550px" }}
              >
                <div className="card shadow-lg">
                  <div className="card-header bg-info text-white">
                    <h5 className="card-title">Ordered Items</h5>
                  </div>
                  <div className="card-body">
                    {orderData?.items?.map((item, index) => (
                      <div key={index} className="mb-3">
                        <strong>{item?.productId?.productName}</strong>
                        <br />
                        <img
                          src={`${serverURL}/public/image/${item?.productId?.images[0]}`}
                          alt={item?.productId?.productName}
                          style={{
                            width: "100px",
                            height: "100px",
                            marginTop: "10px",
                          }}
                        />
                        <p className="mb-1">
                          Price: ₹
                          {item?.productId?.finalPrice.toFixed(0) ||
                            item?.price}
                        </p>
                        <p className="mb-1">Quantity: {item?.quantity}</p>
                        <hr />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {step === 2 || step === 3 ? (
        ""
      ) : (
        <div className="">
          {/* <button className="btn btn-primary" onClick={handleUpdate}>
                        Save Changes
                    </button> */}
          <button className="btn btn-primary" onClick={handleLogin2}>
            Update Order
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-4"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="length">Package Length (cm)</label>
              <input
                type="number"
                name="length"
                className="form-control"
                value={orderData.length}
                onChange={(e) =>
                  setOrderData((prev) => ({ ...prev, length: e.target.value }))
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="breadth">Package Breadth (cm)</label>
              <input
                type="number"
                name="breadth"
                className="form-control"
                value={orderData.breadth}
                onChange={(e) =>
                  setOrderData((prev) => ({ ...prev, breadth: e.target.value }))
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="height">Package Height (cm)</label>
              <input
                type="number"
                name="height"
                className="form-control"
                value={orderData.height}
                onChange={(e) =>
                  setOrderData((prev) => ({ ...prev, height: e.target.value }))
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Package Weight (kg)</label>
              <input
                type="number"
                name="weight"
                className="form-control"
                value={orderData.weight}
                onChange={(e) =>
                  setOrderData((prev) => ({ ...prev, weight: e.target.value }))
                }
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-4">
              Submit
            </button>
          </form>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default EditOrder;
