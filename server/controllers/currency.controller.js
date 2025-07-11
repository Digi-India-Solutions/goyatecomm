import geoip from "geoip-lite";
import axios from "axios";

let cachedRates = null;
let lastFetched = 0;

async function getExchangeRates() {
  const now = Date.now();
  if (cachedRates && now - lastFetched < 3600000) return cachedRates;
  const res = await axios.get(`https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD`);
  cachedRates = res.data.conversion_rates;
  lastFetched = now;
  return cachedRates;
}

const detectCountry = (req, res) => {
    const fakeIP = "49.37.170.33"
  const ip = fakeIP || req.headers["x-forwarded-for"] || req.connection.remoteAddress ;
  const geo = geoip.lookup(ip);
  const country = geo?.country || "US";
  return res.status(200).json({ country });
};

export { detectCountry, getExchangeRates };
