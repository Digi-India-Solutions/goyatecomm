import mongoose from "mongoose";

const levelSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  levelImage: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 3,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});


export const Level = mongoose.model("Level", levelSchema);