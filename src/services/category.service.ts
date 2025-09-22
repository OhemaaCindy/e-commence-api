import { prisma } from "../config/prisma";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "./cloudinary-upload.service";

// export async function createCategory(name: string) {
//   return prisma.category.create({ data: { name } });
// }
export async function createCategory(
  name: string,
  imageFile?: Express.Multer.File
) {
  const data: any = { name };

  // Upload image to Cloudinary if provided
  if (imageFile) {
    try {
      const uploadResult = await uploadToCloudinary(
        imageFile.buffer,
        "categories"
      );
      data.imageUrl = uploadResult.secure_url;
      data.publicId = uploadResult.public_id;
    } catch (error) {
      throw new Error("Failed to upload image");
    }
  }

  return prisma.category.create({ data });
}

// export async function updateCategory(id: string, name: string) {
//   return prisma.category.update({ where: { id }, data: { name } });
// }

// export async function deleteCategory(id: string) {
//   return prisma.category.delete({ where: { id } });
// }
export async function updateCategory(
  id: string,
  name?: string,
  imageFile?: Express.Multer.File
) {
  // Get existing category to check for existing image
  const existingCategory = await prisma.category.findUnique({
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
      await deleteFromCloudinary(existingCategory.publicId);
    }

    // Upload new image
    try {
      const uploadResult = await uploadToCloudinary(
        imageFile.buffer,
        "categories"
      );
      imageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    } catch (error) {
      throw new Error("Failed to upload new image");
    }
  }

  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (imageFile) {
    updateData.imageUrl = imageUrl;
    updateData.publicId = publicId;
  }

  return prisma.category.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteCategory(id: string) {
  // Get category to check for associated image
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // Delete image from Cloudinary if it exists
  if (category.publicId) {
    await deleteFromCloudinary(category.publicId);
  }

  // Delete category from database
  return prisma.category.delete({ where: { id } });
}

export async function getCategory(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export async function listCategories() {
  return prisma.category.findMany({ orderBy: { createdAt: "desc" } });
}
