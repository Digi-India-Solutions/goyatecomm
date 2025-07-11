import { Banner } from "../models/banner.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import { deleteLocalImage } from "../utils/image.util.js";

export const createBanner = async (req, res) => {
  try {
    const { isActive } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Banner image is required" });
    }

    const imageUrl =   req.file.filename

    if (!imageUrl) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    const banner = await Banner.create({ bannerImage: imageUrl, isActive });
    return res.status(201).json({ message: "Banner created", banner });
  } catch (error) {
    if(req.file){
      await deleteLocalImage(req.file.path);
    }
    console.error("Create Banner Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in create banner" });
  }
};

export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    return res.status(200).json(banners);
  } catch (error) {
    console.error("Get All Banners Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    return res.status(200).json(banner);
  } catch (error) {
    console.error("Get Banner by ID Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in get banner" });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { isActive } = req.body;
    const banner = await Banner.findById(req.params.id);

    if (!banner) return res.status(404).json({ message: "Banner not found" });

    if (req.file) {
      const imageUrl =  req.file.filename
      if (imageUrl) banner.bannerImage = imageUrl;
    } else {
      banner.bannerImage = banner.bannerImage;
    }
    banner.isActive = isActive ?? banner.isActive;
    await banner.save();
    return res.status(200).json({ message: "Banner updated", banner });
  } catch (error) {
     if(req.file){
      await deleteLocalImage(req.file.path);
    }
    console.error("Update Banner Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in update banner" });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    return res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Delete Banner Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in delete banner" });
  }
};

