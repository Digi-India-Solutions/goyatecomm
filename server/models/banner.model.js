import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    bannerImage: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);

export const Banner = mongoose.model("Banner", bannerSchema);
