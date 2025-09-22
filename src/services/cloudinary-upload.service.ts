import { cloudinary } from "../utils/cloudinary";

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = "categories"
): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: folder,
          transformation: [
            { width: 500, height: 500, crop: "fill", quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    // Don't throw error to prevent deletion failure if image is already gone
  }
};
