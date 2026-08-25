import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", (req, res) => {
  const {
    username,
    password,
  } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (
    !adminUsername ||
    !adminPassword ||
    !jwtSecret
  ) {
    res.status(503).json({
      message: "Admin authentication is not configured",
    });
    return;
  }

  if (
    username !== adminUsername ||
    password !== adminPassword
  ) {
    res.status(401).json({
      message: "Invalid credentials",
    });
    return;
  }

  const token = jwt.sign(
    {
      role: "admin",
    },
    jwtSecret,
    {
      expiresIn: "12h",
    }
  );

  res.json({
    token,
  });
});

export default router;