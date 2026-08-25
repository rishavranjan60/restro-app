import { Request, Response } from "express";
import { OrderModel } from "../models/order.model";

export const placeOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      phone,
      table,
      items,
      total,
    } = req.body;

    if (
      !name ||
      !phone ||
      !table ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      res.status(400).json({
        message: "Missing or invalid order fields",
      });
      return;
    }

    const order = await OrderModel.create({
      name,
      phone,
      table,
      items,
      total,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Error placing order:", error);

    res.status(500).json({
      message: "Failed to place order",
    });
  }
};

export const getOrders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await OrderModel.find().sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};