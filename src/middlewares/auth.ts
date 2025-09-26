import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { UserType } from "../types/express";

// export interface AuthRequest extends Request {
//   user?: { id: string; role: "USER" | "ADMIN" };
// }

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : undefined;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId, role: payload.role } as UserType;
    console.log("🚀 ~ authenticate ~ req.user:", req.user);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function authorize(roles: Array<"USER" | "ADMIN">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({
        message: "Forbidden - Your are not authorized to access this resource",
      });
    next();
  };
}
