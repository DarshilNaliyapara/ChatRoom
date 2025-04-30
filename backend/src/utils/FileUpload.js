import { v2 as File } from "cloudinary";
import fs from "fs";
File.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.error("Invalid file path provided:", localFilePath);
      return null;
    }

    const response = await File.uploader.upload(localFilePath, {
      resource_type: "auto",
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      cloud_name: process.env.CLOUDINARY_NAME,
    });
    console.log("File Uploaded to Cloudinary", response.url);
    if (fs.existsSync(localFilePath) || response.url) {
      await fs.promises.unlink(localFilePath).catch((err) => {
        console.error("Error deleting local file:", err);
      });
    }
    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    if (fs.existsSync(localFilePath)) {
      await fs.promises.unlink(localFilePath).catch((err) => {
        console.error("Error deleting local file:", err);
      });
    }
    return null;
  }
};

export { uploadOnCloudinary };
