import type { Request, Response } from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  deleteProductImage,
} from "../services/product.service";

export async function create(req: Request, res: Response) {
  try {
    const productData = req.body;
    const imageFiles = req.files as Express.Multer.File[];

    // Validate that at least 1 image is provided
    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({
        message: "At least 1 product image is required",
      });
    }

    if (imageFiles.length > 5) {
      return res.status(400).json({
        message: "Maximum 5 images allowed per product",
      });
    }

    // Convert string values to appropriate types
    const processedData = {
      ...productData,
      price: parseFloat(productData.price),
      quantity: parseInt(productData.quantity),
      discount: parseInt(productData.discount),
    };

    // Validate the converted values
    if (isNaN(processedData.price) || processedData.price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a valid positive number" });
    }

    if (isNaN(processedData.quantity) || processedData.quantity < 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be a valid non-negative number" });
    }

    const product = await createProduct(processedData, imageFiles);
    res.status(201).json(product);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Create product failed" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const productData = req.body;
    const imageFiles = req.files as Express.Multer.File[];

    // Validate image count if new images are provided
    if (imageFiles && imageFiles.length > 5) {
      return res.status(400).json({
        message: "Maximum 5 images allowed per product",
      });
    }

    // Convert string values to appropriate types where provided
    const processedData: any = { ...productData };

    if (productData.price !== undefined) {
      processedData.price = parseFloat(productData.price);
      if (isNaN(processedData.price) || processedData.price <= 0) {
        return res
          .status(400)
          .json({ message: "Price must be a valid positive number" });
      }
    }

    if (productData.quantity !== undefined) {
      processedData.quantity = parseInt(productData.quantity);
      if (isNaN(processedData.quantity) || processedData.quantity < 0) {
        return res
          .status(400)
          .json({ message: "Quantity must be a valid non-negative number" });
      }
    }

    const product = await updateProduct(id, processedData, imageFiles);
    res.json(product);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Update product failed" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    await deleteProduct(id);
    res.json({ message: "Product deleted successfully" });
  } catch (e: any) {
    res.status(500).json({ message: e.message || "Delete product failed" });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (e: any) {
    res.status(500).json({ message: e.message || "Get product failed" });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const { categoryId } = req.query;
    const products = await getAllProducts(categoryId as string);
    res.json(products);
  } catch (e: any) {
    res.status(500).json({ message: e.message || "Get products failed" });
  }
}

export async function deleteImage(req: Request, res: Response) {
  try {
    const { productId, imageId } = req.params;
    if (!productId || !imageId) {
      return res
        .status(404)
        .json({ message: "ProductId and ImageId are reqired" });
    }

    await deleteProductImage(productId, imageId);
    res.json({ message: "Image deleted successfully" });
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Delete image failed" });
  }
}
