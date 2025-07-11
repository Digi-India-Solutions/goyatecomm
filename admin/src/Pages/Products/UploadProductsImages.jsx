import React, { useState, useRef } from "react"; // add useRef
import axiosInstance from "../../services/FetchNodeServices"; // ✅ your API instance

// ✅ Material UI components
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";

const ImageUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef(null); // 1️⃣ Create ref

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      setUploading(true);
      setSuccess(false);

      const res = await axiosInstance.post(
        "/api/v1/product/upload-multiple-products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload success:", res.data);
      setSuccess(true);
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // 2️⃣ Clear input
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upload Multiple Images
      </Typography>

      <input
        ref={fileInputRef} // 3️⃣ Attach ref
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: 16 }}
      />

      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Images uploaded successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImageUploader;
