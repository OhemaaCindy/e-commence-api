"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.getOne = getOne;
exports.list = list;
const category_service_1 = require("../services/category.service");
// export async function create(req: Request, res: Response) {
//   try {
//     const { name } = req.body;
//     const category = await createCategory(name);
//     res.status(201).json(category);
//   } catch (e: any) {
//     res.status(400).json({ message: e.message || "Create category failed" });
//   }
// }
async function create(req, res) {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }
        const categoryImageFile = req.file;
        const category = await (0, category_service_1.createCategory)(name, categoryImageFile);
        res.status(201).json(category);
    }
    catch (e) {
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
async function update(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const categoryImageFile = req.file;
        const category = await (0, category_service_1.updateCategory)(id, name, categoryImageFile);
        res.status(200).json(category);
    }
    catch (e) {
        res.status(400).json({ message: e.message || "Update category failed" });
    }
}
async function remove(req, res) {
    try {
        const { id } = req.params;
        await (0, category_service_1.deleteCategory)(id);
        res.status(204).json({ message: "Category deleted" });
    }
    catch (e) {
        res.status(500).json({ message: e.message || "Delete category failed" });
    }
}
async function getOne(req, res) {
    const { id } = req.params;
    const category = await (0, category_service_1.getCategory)(id);
    if (!category)
        return res.status(404).json({ message: "Category not found" });
    res.json(category);
}
async function list(req, res) {
    const categories = await (0, category_service_1.listCategories)();
    res.json(categories);
}
//# sourceMappingURL=category.controller.js.map