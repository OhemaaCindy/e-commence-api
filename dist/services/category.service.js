"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.getCategory = getCategory;
exports.listCategories = listCategories;
const prisma_1 = require("../config/prisma");
const cloudinary_upload_service_1 = require("./cloudinary-upload.service");
// export async function createCategory(name: string) {
//   return prisma.category.create({ data: { name } });
// }
async function createCategory(name, imageFile) {
    const data = { name };
    // Upload image to Cloudinary if provided
    if (imageFile) {
        try {
            const uploadResult = await (0, cloudinary_upload_service_1.uploadToCloudinary)(imageFile.buffer, "categories");
            data.imageUrl = uploadResult.secure_url;
            data.publicId = uploadResult.public_id;
        }
        catch (error) {
            throw new Error("Failed to upload image");
        }
    }
    return prisma_1.prisma.category.create({ data });
}
// export async function updateCategory(id: string, name: string) {
//   return prisma.category.update({ where: { id }, data: { name } });
// }
// export async function deleteCategory(id: string) {
//   return prisma.category.delete({ where: { id } });
// }
async function updateCategory(id, name, imageFile) {
    // Get existing category to check for existing image
    const existingCategory = await prisma_1.prisma.category.findUnique({
        where: { id },
    });
    if (!existingCategory) {
        throw new Error("Category not found");
    }
    let imageUrl = existingCategory.imageUrl;
    let publicId = existingCategory.publicId;
    // Handle image update
    if (imageFile) {
        // Delete old image if it exists
        if (existingCategory.publicId) {
            await (0, cloudinary_upload_service_1.deleteFromCloudinary)(existingCategory.publicId);
        }
        // Upload new image
        try {
            const uploadResult = await (0, cloudinary_upload_service_1.uploadToCloudinary)(imageFile.buffer, "categories");
            imageUrl = uploadResult.secure_url;
            publicId = uploadResult.public_id;
        }
        catch (error) {
            throw new Error("Failed to upload new image");
        }
    }
    const updateData = {};
    if (name !== undefined)
        updateData.name = name;
    if (imageFile) {
        updateData.imageUrl = imageUrl;
        updateData.publicId = publicId;
    }
    return prisma_1.prisma.category.update({
        where: { id },
        data: updateData,
    });
}
async function deleteCategory(id) {
    // Get category to check for associated image
    const category = await prisma_1.prisma.category.findUnique({
        where: { id },
    });
    if (!category) {
        throw new Error("Category not found");
    }
    // Delete image from Cloudinary if it exists
    if (category.publicId) {
        await (0, cloudinary_upload_service_1.deleteFromCloudinary)(category.publicId);
    }
    // Delete category from database
    return prisma_1.prisma.category.delete({ where: { id } });
}
async function getCategory(id) {
    return prisma_1.prisma.category.findUnique({ where: { id } });
}
async function listCategories() {
    return prisma_1.prisma.category.findMany({ orderBy: { createdAt: "desc" } });
}
//# sourceMappingURL=category.service.js.map