import { Router } from "express";

const router = Router();

let tables = [
  { id: 1, status: "Available" },
  { id: 2, status: "Occupied" },
  { id: 3, status: "Available" }
];

// Get all tables
router.get("/", (req, res) => {
  res.json(tables);
});

// Update table status
router.put("/:id", (req, res) => {
  const tableId = parseInt(req.params.id);
  const { status } = req.body;

  const index = tables.findIndex(t => t.id === tableId);
  if (index !== -1) {
    tables[index].status = status;
    res.json({ success: true, updated: tables[index] });
  } else {
    res.status(404).json({ error: "Table not found" });
  }
});

export default router;
