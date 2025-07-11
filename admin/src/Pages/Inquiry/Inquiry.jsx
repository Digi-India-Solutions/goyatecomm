import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/FetchNodeServices";
import Swal from "sweetalert2";

const AllInquiries = () => {
  const [inquiries, setInquiries] = useState([]);

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This video URL will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `/api/v1/contact-form/delete-contact/${id}`
        );
        if (response.status === 200) {
          setInquiries(inquiries?.filter((inquiry) => inquiry?._id !== id));
          Swal.fire("Deleted!", "Inquiry has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire("Error!", "Error deleting the inquiry.", "error");
        console.error("Error deleting inquiry:", error);
      }
    }
  };
  const fetchInquiries = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/contact-form/get-all-contact");
      if (response.status === 200) {
        setInquiries(response.data);
      } else {
        console.error("Failed to fetch inquiries:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <>
      <div className="bread">
        <div className="head">
          <h4>All Inquiries</h4>
        </div>
      </div>

      <section className="main-table">
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>subject</th>
                <th>message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length > 0 ? (
                inquiries.map((inquiry, index) => (
                  <tr key={inquiry._id}>
                    <td>{index + 1}</td>
                    <td>{inquiry.name}</td>
                    <td>{inquiry.email}</td>
                    <td>{inquiry.subject}</td>
                    <td >{inquiry.message}</td>
                    <td>{new Date(inquiry.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="bt delete"
                        onClick={() => handleDelete(inquiry?._id)}
                      >
                        Delete <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No inquiries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default AllInquiries;
