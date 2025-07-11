import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../services/FetchNodeServices";
import Swal from "sweetalert2";

const UpdateProductCurrency = () => {
  const [usd, setUsd] = useState("");
  const [eur, setEur] = useState("");
  const [pound,setPound]=useState("")
  const [loading, setLoading] = useState(false);
const [currencyLoading, setCurrencyLoading] = useState(false);
  const fetchRatesFromAPI = async () => {
    try {
      setCurrencyLoading(true);
      const res = await axios.get(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      const rateData = res.data.rates;

      setUsd(rateData.INR);
      setEur(rateData.EUR.toFixed(2));
      setPound(rateData.GBP.toFixed(2));

    } catch (error) {
      console.error("API error:", error);
      alert("Failed to fetch currency rates.");
    } finally {
      setCurrencyLoading(false);
    }
  };

  const updatePrices = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(
        "/api/v1/product/update-product-currency-price",
        {
          UsdToInr: parseFloat(usd),
          UsdToEur: parseFloat(eur),
          UsdToPound: parseFloat(pound),
        }
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product prices updated successfully.",
        timer: 2000,
        showConfirmButton: true,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update product prices.",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatesFromAPI(); // Fetch on load
  }, []);

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-4 text-center">Product Currency Price Updater</h3>

          <div className="mb-3">
            <label className="form-label">USD to INR</label>
            <input
              type="number"
              value={usd}
              onChange={(e) => setUsd(e.target.value)}
              className="form-control"
              placeholder="Enter USD to INR"
            />
          </div>

          <div className="mb-4">
            <label className="form-label">USD to EUR</label>
            <input
              type="number"
              value={eur}
              onChange={(e) => setEur(e.target.value)}
              className="form-control"
              placeholder="Enter EUR to INR"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">USD to Pound</label>
            <input
              type="number"
              value={pound}
              onChange={(e) => setPound(e.target.value)}
              className="form-control"
              placeholder="Enter EUR to INR"
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              onClick={fetchRatesFromAPI}
              className="btn btn-outline-primary"
              disabled={currencyLoading}
            >
              {currencyLoading ? "Fetching..." : "Refresh from API"}
            </button>

            <button
              onClick={updatePrices}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product Prices"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductCurrency;
