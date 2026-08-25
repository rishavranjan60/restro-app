
import { Router } from "express";
import { TableModel } from "../models/table.model";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    let tables = await TableModel.find().sort({
      number: 1,
    });

    if (tables.length === 0) {
      tables = await TableModel.insertMany([
        {
          number: 1,
          status: "Available",
        },
        {
          number: 2,
          status: "Available",
        },
        {
          number: 3,
          status: "Available",
        },
      ]);
    }

    res.json(tables);
  } catch (error) {
    next(error);
  }
});

router.put("/:number", requireAdmin, async (req, res, next) => {
  try {
    const number = Number(req.params.number);
    const { status } = req.body;

    const validStatuses = [
      "Available",
      "Occupied",
    ];

    if (
      !Number.isInteger(number) ||
      number < 1 ||
      !validStatuses.includes(status)
    ) {
      res.status(400).json({
        error: "Invalid table number or status",
      });
      return;
    }

    const table = await TableModel.findOneAndUpdate(
      {
        number,
      },
      {
        number,
        status,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      updated: table,
    });
  } catch (error) {
    next(error);
  }
});

export default router;