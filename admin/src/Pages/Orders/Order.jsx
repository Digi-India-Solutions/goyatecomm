import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../../services/FetchNodeServices";

const UploadOrders = () => {
  const [jsonData, setJsonData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    setUploadStatus("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json(sheet);
      setJsonData(json);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (jsonData.length === 0) {
      alert("No data to upload.");
      return;
    }
    if (!jsonData[0].Description?.trim()) {
      toast.error("Description field is missing in the uploaded file.");
      return;
    }
    if (!jsonData[0].Amount?.trim()) {
      toast.error("Amount field is missing in the uploaded file.");
      return;
    }
    if (!jsonData[0].date?.trim()) {
      toast.error("date field is missing in the uploaded file.");
      return;
    }

    if (!jsonData[0].transactionType?.trim()) {
      toast.error("transactionType field is missing in the uploaded file.");
      return;
    }
    const filteredData = jsonData.filter(
      (item) => item.transactionType === "Cr."
    );

    if (filteredData.length === 0) {
      toast.error(
        "No valid data to upload. Please check the transactionType field."
      );
      return;
    }
    console.log("Filtered Data:", filteredData);
    
    const loader = toast.loading("Uploading orders...");
    try {
      const response = await axiosInstance.post(
        "/api/v1/order/upload-orders",
        { orders: filteredData }
      );
      toast.dismiss(loader);
      setJsonData([]);
      toast.success("Orders uploaded successfully!");
      setUploadStatus("✅ Upload successful!");
      console.log(response.data);
    } catch (error) {
      toast.dismiss(loader);
      console.error("Upload failed:", error);
      setUploadStatus("❌ Upload failed. Check console for details.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Upload Orders from Excel</h2>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {fileName && (
        <p className="mb-2 text-sm text-gray-600">Uploaded: {fileName}</p>
      )}

      {jsonData.length > 0 && (
        <>
          <button className="btn btn-primary mb-3" onClick={handleUpload}>
            Upload Orders
          </button>
          <p className="mb-2 text-green-600">{uploadStatus}</p>
        </>
      )}

      {jsonData.length === 0 ? (
        <p className="text-gray-500">No data to upload.</p>
      ) : (
        <p>Orders {jsonData.length} is ready to upload</p>
      )}
    </div>
  );
};

export default UploadOrders;
