import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./Db/index.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

if (process.env.NODE_ENV === "development") {
  const morgan = await import("morgan");
  app.use(morgan.default("dev"));
}

app.use("/public/image", express.static(path.join(__dirname, "public/images")));


app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({limit: "1000mb", extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://192.168.166.80:3001",
  "https://goyattrading.shop",
  "https://admin.goyattrading.shop",
  "https://www.goyattrading.shop",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

connectDB();


import userRouter from "./routes/auth.route.js";
import bannerRoute from "./routes/banner.route.js";
import categoryRoute from "./routes/category.route.js";
import productRoute from "./routes/product.route.js";
import wishlistRoute from "./routes/wishlist.route.js";
import couponRoute from "./routes/coupon.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";
import contactFormRoute from "./routes/contactForm.route.js";
import mainCategoryRoute from "./routes/mainCategory.route.js";
import subCategoryRoute from "./routes/subCategory.route.js";
import currencyRoute from "./routes/currency.route.js";
import levelRoute from "./routes/level.route.js";

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/banner", bannerRoute);
app.use("/api/v1/mainCategory", mainCategoryRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/subcategory", subCategoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/coupon", couponRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/contact-form", contactFormRoute);
app.use("/api/v1/currency", currencyRoute);
app.use("/api/v1/level",levelRoute)

app.get("/", (req, res) => {
  res.send("Server is running");
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
