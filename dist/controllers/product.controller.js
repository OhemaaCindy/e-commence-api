"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.getOne = getOne;
exports.list = list;
exports.deleteImage = deleteImage;
const product_service_1 = require("../services/product.service");
async function create(req, res) {
    try {
        const productData = req.body;
        const imageFiles = req.files;
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
        const product = await (0, product_service_1.createProduct)(processedData, imageFiles);
        res.status(201).json(product);
    }
    catch (e) {
        res.status(400).json({ message: e.message || "Create product failed" });
    }
}
async function update(req, res) {
    try {
        const { id } = req.params;
        const productData = req.body;
        const imageFiles = req.files;
        // Validate image count if new images are provided
        if (imageFiles && imageFiles.length > 5) {
            return res.status(400).json({
                message: "Maximum 5 images allowed per product",
            });
        }
        // Convert string values to appropriate types where provided
        const processedData = { ...productData };
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
        const product = await (0, product_service_1.updateProduct)(id, processedData, imageFiles);
        res.json(product);
    }
    catch (e) {
        res.status(400).json({ message: e.message || "Update product failed" });
    }
}
async function remove(req, res) {
    try {
        const { id } = req.params;
        await (0, product_service_1.deleteProduct)(id);
        res.json({ message: "Product deleted successfully" });
    }
    catch (e) {
        res.status(500).json({ message: e.message || "Delete product failed" });
    }
}
async function getOne(req, res) {
    try {
        const { id } = req.params;
        const product = await (0, product_service_1.getProductById)(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    }
    catch (e) {
        res.status(500).json({ message: e.message || "Get product failed" });
    }
}
async function list(req, res) {
    try {
        const { categoryId } = req.query;
        const products = await (0, product_service_1.getAllProducts)(categoryId);
        res.json(products);
    }
    catch (e) {
        res.status(500).json({ message: e.message || "Get products failed" });
    }
}
async function deleteImage(req, res) {
    try {
        const { productId, imageId } = req.params;
        if (!productId || !imageId) {
            return res
                .status(404)
                .json({ message: "ProductId and ImageId are reqired" });
        }
        await (0, product_service_1.deleteProductImage)(productId, imageId);
        res.json({ message: "Image deleted successfully" });
    }
    catch (e) {
        res.status(400).json({ message: e.message || "Delete image failed" });
    }
}
//# sourceMappingURL=product.controller.js.map