import React, { useState } from "react";
import * as XLSX from "xlsx";
import axiosInstance from "../../services/FetchNodeServices";

const ExcelCategoryUploader = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

        setCategories(jsonData);
        console.log("Excel data parsed (categories):", jsonData);
      } catch (error) {
        console.error("Parsing failed:", error);
        alert("❌ Failed to parse Excel file.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    if (!categories.length) {
      alert("No data to upload. Please upload an Excel file first.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/v1/category/create-multiple-category", {
        categories,
      });

      console.log("Server response:", res.data);
      alert("✅ Categories uploaded successfully.");
      setCategories([]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Failed to upload categories.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body text-center">
          <h4 className="card-title mb-4">Bulk Category Upload</h4>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
            className="form-control mb-3"
          />

          {categories.length > 0 && (
            <div className="alert alert-success" role="alert">
              {categories.length} categories ready to upload
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || categories.length === 0}
            className="btn btn-primary"
          >
            {loading ? "Uploading..." : "Submit Categories"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelCategoryUploader;
