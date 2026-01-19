"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("../utils/cloudinary");
const uploadToCloudinary = (buffer, folder = "categories") => {
    return new Promise((resolve, reject) => {
        cloudinary_1.cloudinary.uploader
            .upload_stream({
            resource_type: "image",
            folder: folder,
            transformation: [
                { width: 500, height: 500, crop: "fill", quality: "auto" },
            ],
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        })
            .end(buffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary_1.cloudinary.uploader.destroy(publicId);
    }
    catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        // Don't throw error to prevent deletion failure if image is already gone
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
//# sourceMappingURL=cloudinary-upload.service.js.map