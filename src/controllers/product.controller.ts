import { Request, Response } from "express";
import {
  createProduct,
  updateProduct,
  getProduct,
  listProducts,
} from "../services/product.service";
import { cloudinary } from "../utils/cloudinary";
import fs from "fs";

export async function create(req: Request, res: Response) {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Create product failed" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const product = await updateProduct(id, req.body);
    res.json(product);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Update product failed" });
  }
}

export async function getOne(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const product = await getProduct(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}

export async function list(req: Request, res: Response) {
  const products = await listProducts();
  res.json(products);
}

export async function uploadImage(req: Request, res: Response) {
  try {
    // multer stores file at req.file.path when using disk storage
    const filePath = (req as any).file?.path as string | undefined;
    if (!filePath) return res.status(400).json({ message: "No file uploaded" });
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "products",
    });
    fs.unlinkSync(filePath);
    return res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (e: any) {
    return res.status(400).json({ message: e.message || "Upload failed" });
  }
}
