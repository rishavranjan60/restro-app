import { Router } from "express";

const router = Router();

// Dummy auth route
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    res.json({ token: "dummy_token" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

export default router;
