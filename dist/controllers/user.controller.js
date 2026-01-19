"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
exports.register = register;
exports.login = login;
exports.authUser = authUser;
exports.update = update;
exports.list = list;
exports.getOne = getOne;
const user_service_1 = require("../services/user.service");
async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        const result = await (0, user_service_1.registerUser)(username, email, password);
        res.status(201).json(result);
    }
    catch (e) {
        res.status(400).json({ message: e.message || "Registration failed" });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        console.log(`🚀 ~ login ~ { email, password }:`, { email, password });
        const result = await (0, user_service_1.loginUser)(email, password);
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ message: e.message || "Login failed" });
    }
}
async function authUser(req, res) {
    var _a;
    const userId = ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
    const user = await (0, user_service_1.getUserById)(userId);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user);
}
async function update(req, res) {
    try {
        const { id } = req.params;
        const result = await (0, user_service_1.updateUser)(id, req.body);
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ message: e.message || "Update failed" });
    }
}
async function list(req, res) {
    const users = await (0, user_service_1.getAllUsers)();
    res.json(users);
}
async function getOne(req, res) {
    const { id } = req.params;
    const user = await (0, user_service_1.getUserById)(id);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user);
}
const logout = (req, res) => {
    res.sendStatus(204);
    // res.clearCookie("token").status(204).json({ message: "Logout successful" });
};
exports.logout = logout;
//# sourceMappingURL=user.controller.js.map