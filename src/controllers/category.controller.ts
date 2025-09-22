import type { Request, Response } from "express";
import {
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
  listCategories,
} from "../services/category.service";

// export async function create(req: Request, res: Response) {
//   try {
//     const { name } = req.body;
//     const category = await createCategory(name);
//     res.status(201).json(category);
//   } catch (e: any) {
//     res.status(400).json({ message: e.message || "Create category failed" });
//   }
// }
export async function create(req: Request, res: Response) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const categoryImageFile: Express.Multer.File | undefined = req.file;
    const category = await createCategory(name, categoryImageFile);

    res.status(201).json(category);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Create category failed" });
  }
}

// export async function update(req: Request, res: Response) {
//   try {
//     const { id } = req.params as { id: string };
//     const { name } = req.body;
//     const category = await updateCategory(id, name);
//     res.json(category);
//   } catch (e: any) {
//     res.status(400).json({ message: e.message || "Update category failed" });
//   }
// }
export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const { name } = req.body;

    const categoryImageFile: Express.Multer.File | undefined = req.file;
    const category = await updateCategory(id, name, categoryImageFile);

    res.status(200).json(category);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Update category failed" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    await deleteCategory(id);
    res.status(204).json({ message: "Category deleted" });
  } catch (e: any) {
    res.status(500).json({ message: e.message || "Delete category failed" });
  }
}

export async function getOne(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const category = await getCategory(id);
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json(category);
}

export async function list(req: Request, res: Response) {
  const categories = await listCategories();
  res.json(categories);
}
