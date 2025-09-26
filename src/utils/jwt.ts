import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayloadShape {
  userId: string;
  role: "USER" | "ADMIN";
}

export function signToken(
  payload: JwtPayloadShape,
  expiresIn: "7d" | "15min" = "7d"
): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn });
}

export function verifyToken(token: string): JwtPayloadShape {
  return jwt.verify(token, env.jwtSecret) as JwtPayloadShape;
}
