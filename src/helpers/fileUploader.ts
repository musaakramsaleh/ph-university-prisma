import multer from "multer";
import path from "path";
import fs from 'fs'
import { v2 as cloudinary } from "cloudinary";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";
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

export const uploadToCloudinary = async (file: IFile):Promise<ICloudinaryResponse> => {
  console.log(file);
  return new Promise((resolve,reject) =>{
  cloudinary.uploader.upload(file.path,
    // {public_id: file.originalname},
    (error:Error,result:ICloudinaryResponse)=> {
      fs.unlinkSync(file.path)
      if(error){
        reject(error)
      }else{
        resolve(result)
      }
    }
  );
  })
  
};
