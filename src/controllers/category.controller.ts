import { Request, Response } from "express";
import {
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
  listCategories,
} from "../services/category.service";

export async function create(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const category = await createCategory(name);
    res.status(201).json(category);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Create category failed" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const { name } = req.body;
    const category = await updateCategory(id, name);
    res.json(category);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Update category failed" });
  }
}

export async function getOne(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const category = await getCategory(id);
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json(category);
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  await deleteCategory(id);
  res.json({ message: "Category deleted" });
}

export async function list(req: Request, res: Response) {
  const categories = await listCategories();
  res.json(categories);
}
