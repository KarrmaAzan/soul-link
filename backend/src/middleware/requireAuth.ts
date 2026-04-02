import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export type AuthenticatedRequest = Request & {
  user?: {
    userId: number;
    username: string;
  };
};

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = verifyToken(token);

    console.log("requireAuth payload =", payload);

    if (!payload?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = {
      userId: Number(payload.userId),
      username: payload.username,
    };

    return next();
  } catch (error) {
    console.error("requireAuth failed:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}