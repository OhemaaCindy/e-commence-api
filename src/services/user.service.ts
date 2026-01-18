import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { signToken } from "../utils/jwt";

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already in use");
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, password: hashed },
  });
  const token = signToken({ userId: user.id, role: user.role });
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

export async function loginUser(email: string, password: string) {
  try{
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("🚀 ~ loginUser ~ user:", user)
  if (!user) throw new Error("Invalid credentials");
  const ok = await bcrypt.compare(password, user.password);
  console.log("🚀 ~ loginUser ~ ok:", ok)
  if (!ok) throw new Error("Invalid credentials");
  const token = signToken({ userId: user.id, role: user.role });
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  };
  }catch(error){
  console.log("🚀 ~ loginUser ~ error:", error)
throw error
  }
}

export async function updateUser(
  id: string,
  data: { username?: string; email?: string }
) {
  const user = await prisma.user.update({ where: { id }, data });
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

export async function getAllUsers() {
  interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return users.map((u:User) => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
  }));
}

export async function getUserById(id: string | null) {
  if (typeof id !== "string") return null;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}
