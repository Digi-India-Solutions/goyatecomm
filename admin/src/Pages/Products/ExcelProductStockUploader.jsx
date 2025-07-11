import React, { useState } from "react";
import * as XLSX from "xlsx";
import axiosInstance from "../../services/FetchNodeServices";
import { toast } from "react-toastify";

const ExcelProductStockUploader = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const loadingToast = toast.loading("Parsing Excel file...", {
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
          toast.update(loadingToast, {
            render: " Excel file is empty!",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          return;
        }

        // Validate required fields
        const requiredFields = ["ISBN13", "stock"];
        const isValid = requiredFields.every((field) =>
          Object.keys(jsonData[0]).includes(field)
        );

        if (!isValid) {
          toast.update(loadingToast, {
            render: " Columns must include: ISBN13 and stock",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          return;
        }

        toast.update(loadingToast, {
          render: " Excel parsed successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });

        setStockData(jsonData);
      } catch (error) {
        console.error("Parsing error:", error);
        toast.update(loadingToast, {
          render: " Failed to parse Excel file.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    if (!stockData.length) {
      toast.error(" No data to upload. Upload an Excel file first.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/v1/product/update-product-stock", {
        products: stockData,
      });

      toast.success("Stock updated successfully.");
      setStockData([]);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to update stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body text-center">
          <h4 className="card-title mb-4">Upload Product Stock (Excel)</h4>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
            className="form-control mb-3"
          />

          {stockData.length > 0 && (
            <div className="alert alert-success" role="alert">
              {stockData.length} product stock entries ready to upload
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || stockData.length === 0}
            className="btn btn-primary"
          >
            {loading ? "Uploading..." : "Submit Stock Updates"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelProductStockUploader;
