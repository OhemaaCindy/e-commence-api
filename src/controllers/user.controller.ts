import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  updateUser,
  getAllUsers,
  getUserById,
} from "../services/user.service";

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    const result = await registerUser(username, email, password);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    console.log(`🚀 ~ login ~ { email, password }:`, { email, password })
    const result = await loginUser(email, password);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Login failed" });
  }
}

export async function authUser(req: Request, res: Response) {
  const userId = req?.user?.id || null;
  const user = await getUserById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const result = await updateUser(id, req.body);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Update failed" });
  }
}

export async function list(req: Request, res: Response) {
  const users = await getAllUsers();
  res.json(users);
}

export async function getOne(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const user = await getUserById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}

export const logout = (req: Request, res: Response) => {
  res.sendStatus(204);
  // res.clearCookie("token").status(204).json({ message: "Logout successful" });
};
