import multer from "multer";
import path from "path";
import fs from "fs";

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const uploadPath = "./public/images";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});


const ImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    ensureDirExists(uploadPath); 
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const uploadImages = multer({
  storage: ImageStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});
