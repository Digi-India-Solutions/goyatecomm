import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    PRODUCTS_ID: {
      type: String,
    },
    images: {
      type: [String],
    },
    mainCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainCategory",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    description: {
      type: String,
    },
    highlights: {
      type: String,
    },
    details: {
      type: String,
    },
    author: {
      type: String,
    },
    pages: {
      type: String,
    },
    ISBN: {
      type: String,
    },
    ISBN13: {
      type: String,
    },
    publisher: {
      type: String,
    },
    publicationDate: {
      type: String,
    },
    language: {
      type: String,
    },
    newArrival: {
      type: Boolean,
      required: true,
      default: false,
    },
    featuredBooks: {
      type: Boolean,
      required: true,
      default: false,
    },
    bestSellingBooks: {
      type: Boolean,
      required: true,
      default: false,
    },
    priceInDollors: {
      type: Number,
    },
    priceInEuros: {
      type: Number,
    },
    priceInPounds:{
      type: Number,
    },
    price: {
      type: Number,
    },
    finalPrice: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    stock: {
      type: Number,
      default: 99999999,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
