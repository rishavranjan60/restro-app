import {
  NextFunction,
  Request,
  Response,
} from "express";
import jwt from "jsonwebtoken";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorization = req.header("authorization");

  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  const jwtSecret = process.env.JWT_SECRET;

  if (!token || !jwtSecret) {
    res.status(401).json({
      message: "Admin authorization is required",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret);

    if (
      typeof payload === "string" ||
      payload.role !== "admin"
    ) {
      res.status(403).json({
        message: "Admin permission is required",
      });
      return;
    }

    next();
  } catch {
    res.status(401).json({
      message: "Admin token is invalid or expired",
    });
  }
};