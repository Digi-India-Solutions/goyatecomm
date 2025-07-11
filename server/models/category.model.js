import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  SubCategoryName: {
    type: String,
    required: true,
  },
  Parent_name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MainCategory",
  },
  Sub_CATEGORIES_ID:{
   type:String,
  },
  categoryImage: {
    type: String,
    // required: true,
  },

});

export const Category = mongoose.model("Category", categorySchema);
