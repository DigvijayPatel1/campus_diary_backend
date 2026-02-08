import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (localFilePath) => {
    const cleanupLocalFile = async () => {
        if (!localFilePath) return;

        try {
            await fs.promises.unlink(localFilePath);
        } catch (unlinkError) {
            if (unlinkError?.code !== "ENOENT") {
                console.error("Failed to remove local upload:", unlinkError);
            }
        }
    };

    try {
      
        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return null;
    } finally {
        await cleanupLocalFile();
    }
};

export { uploadOnCloudinary }
