import { User } from "../generated/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}

export type UserType = {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
};
