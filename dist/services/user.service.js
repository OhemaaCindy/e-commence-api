"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.updateUser = updateUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../config/prisma");
const jwt_1 = require("../utils/jwt");
async function registerUser(username, email, password) {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existing)
        throw new Error("Email already in use");
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
        data: { username, email, password: hashed },
    });
    const token = (0, jwt_1.signToken)({ userId: user.id, role: user.role });
    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
        token,
    };
}
async function loginUser(email, password) {
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        console.log("🚀 ~ loginUser ~ user:", user);
        if (!user)
            throw new Error("Invalid credentials");
        const ok = await bcryptjs_1.default.compare(password, user.password);
        console.log("🚀 ~ loginUser ~ ok:", ok);
        if (!ok)
            throw new Error("Invalid credentials");
        const token = (0, jwt_1.signToken)({ userId: user.id, role: user.role });
        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }
    catch (error) {
        console.log("🚀 ~ loginUser ~ error:", error);
        throw error;
    }
}
async function updateUser(id, data) {
    const user = await prisma_1.prisma.user.update({ where: { id }, data });
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
    };
}
async function getAllUsers() {
    const users = await prisma_1.prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    return users.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
    }));
}
async function getUserById(id) {
    if (typeof id !== "string")
        return null;
    const user = await prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user)
        return null;
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
    };
}
//# sourceMappingURL=user.service.js.map