import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + file.originalname);
  },
});
cloudinary.config({
  cloud_name: "du9mgqxub",
  api_key: "125552939751724",
  api_secret: "_sTemn6JZcU8eP5zydERerESLUw",
});

export const upload = multer({ storage: storage });

export const uploadToCloudinary = async (file: any) => {
  cloudinary.uploader.upload(
    "/Users/HP/Desktop/POSTGRES/ph-university-prisma/uploads/file-Frame 1249187666 (1).png",
    function (error, result) {
      console.log(result, error);
    }
  );
};
