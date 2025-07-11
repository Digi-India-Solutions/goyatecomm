import React, { useState } from "react";
import * as XLSX from "xlsx";
import axiosInstance from "../../services/FetchNodeServices";
import { toast } from "react-toastify";

const ExcelCategoryAndSubcategory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    let loading = toast.loading("Parsing Excel file...", {
      position: "top-right",
    });
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (jsonData.length === 0) {
          alert("Excel file is empty!");
          return;
        }

        toast.update(loading, {
          render: "Excel file parsed successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        if (!jsonData[0]?.Categories_id) {
          alert("Category id should be named as Categories_id");
          return;
        }
        if (!jsonData[0]?.Categories_name) {
          alert("Category Name should be named as Categories_name");
          return;
        }
        if (!jsonData[0]?.Parent_id) {
          alert("Parent Id should be named as Parent_id");
          return;
        }
        setProducts(jsonData);
        console.log("Excel data parsed:", jsonData);
      } catch (error) {
        console.error("Parsing failed:", error);
        toast.error("❌ Failed to parse Excel file.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    if (!products.length) {
      alert("No data to upload. Please upload an Excel file first.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/api/v1/category/add-category-and-subcategory",
        {
          categories: products,
        }
      );

      console.log("Server response:", res.data);
      alert("✅ Subcategories uploaded successfully.");
      setProducts([]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Failed to upload subcategories.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body text-center">
          <h4 className="card-title mb-4">Upload Category with Subcategory (Excel)</h4>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
            className="form-control mb-3"
          />

          {products.length > 0 && (
            <div className="alert alert-success" role="alert">
              {products.length} category ready to upload
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || products.length === 0}
            className="btn btn-primary"
          >
            {loading ? "Uploading..." : "Submit Categories"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelCategoryAndSubcategory;
