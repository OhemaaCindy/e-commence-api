import { prisma } from "../config/prisma";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "./cloudinary-upload.service";

interface ProductInput {
  name: string;
  description: string;
  price: number;
  categoryId: string; // Changed from category to categoryId for clarity
  quantity: number;
  brand?: string;
}

export async function createProduct(
  input: ProductInput,
  imageFiles: Express.Multer.File[]
) {
  // Validate category exists
  const categoryExists = await prisma.category.findUnique({
    where: { id: input.categoryId },
  });

  if (!categoryExists) {
    throw new Error("Category not found");
  }

  // Upload all images to Cloudinary
  const imageUploadPromises = imageFiles.map((file) =>
    uploadToCloudinary(file.buffer, "products")
  );

  let uploadResults;
  try {
    uploadResults = await Promise.all(imageUploadPromises);
  } catch (error) {
    throw new Error("Failed to upload one or more images");
  }

  // Build data object dynamically
  const data: any = {
    name: input.name,
    description: input.description,
    price: input.price,
    quantity: input.quantity,
    categoryId: input.categoryId,
    images: {
      create: uploadResults.map((result) => ({
        imageUrl: result.secure_url,
        publicId: result.public_id,
      })),
    },
  };

  // Only add brand if it has a value
  if (input.brand) {
    data.brand = input.brand;
  }

  // Create product with images
  const product = await prisma.product.create({
    data,
    include: {
      images: true,
      category: true,
    },
  });

  return product;
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>,
  imageFiles?: Express.Multer.File[]
) {
  // Check if product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  // Validate category if provided
  if (input.categoryId) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });

    if (!categoryExists) {
      throw new Error("Category not found");
    }
  }

  const updateData: any = {};

  // Update basic product fields
  if (input.name !== undefined) updateData.name = input.name;
  if (input.description !== undefined)
    updateData.description = input.description;
  if (input.price !== undefined) updateData.price = input.price;
  if (input.quantity !== undefined) updateData.quantity = input.quantity;
  if (input.brand !== undefined) updateData.brand = input.brand;
  if (input.categoryId !== undefined) updateData.categoryId = input.categoryId;

  // Handle image updates if image file are provided
  if (imageFiles && imageFiles.length > 0) {
    // Check if total images would exceed limit
    const currentImageCount = existingProduct.images.length;
    if (currentImageCount + imageFiles.length > 5) {
      throw new Error(
        "Total images would exceed maximum of 5. Please remove some existing images first."
      );
    }

    // Upload new images
    const imageUploadPromises = imageFiles.map((file) =>
      uploadToCloudinary(file.buffer, "products")
    );

    let uploadResults;
    try {
      uploadResults = await Promise.all(imageUploadPromises);
    } catch (error) {
      throw new Error("Failed to upload one or more new images");
    }

    // Add new images to the product
    updateData.images = {
      create: uploadResults.map((result) => ({
        imageUrl: result.secure_url,
        publicId: result.public_id,
      })),
    };
  }

  // Update product
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      images: true,
      category: true,
    },
  });

  return updatedProduct;
}

export async function deleteProduct(id: string) {
  // Get product with images
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Delete all images from Cloudinary
  const deletePromises = product.images.map((image) =>
    deleteFromCloudinary(image.publicId)
  );

  try {
    await Promise.all(deletePromises);
  } catch (error) {
    // NOTE:Continue with product deletion even if image deletion fails
    console.error("Error deleting images from Cloudinary:", error);
  }

  // Delete product (images will be deleted automatically due to cascade)
  return prisma.product.delete({ where: { id } });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      category: true,
    },
  });
}

export async function getAllProducts(categoryId?: string) {
  const whereClause = categoryId ? { categoryId } : {};

  return prisma.product.findMany({
    where: whereClause,
    include: {
      images: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// 5. Additional utility function for managing individual images
export async function deleteProductImage(productId: string, imageId: string) {
  // Get the image to delete
  const image = await prisma.productImage.findFirst({
    where: {
      id: imageId,
      productId: productId,
    },
  });

  if (!image) {
    throw new Error("Image not found");
  }

  // Check if this is the last image (must have at least 1)
  const imageCount = await prisma.productImage.count({
    where: { productId: productId },
  });

  if (imageCount <= 1) {
    throw new Error(
      "Cannot delete the last image. Product must have at least 1 image."
    );
  }

  // Delete from Cloudinary
  await deleteFromCloudinary(image.publicId);

  // Delete from database
  return prisma.productImage.delete({
    where: { id: imageId },
  });
}
