import { Request, Response } from "express";
import { Order, orders } from "../models/order.model";

let orderId = 1;

export const placeOrder = (req: Request, res: Response) => {
  const { name, phone, table, items, total } = req.body;

  const newOrder: Order = {
    id: orderId++,
    name,
    phone,
    table,
    items,
    total,
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);

  res.status(201).json({ message: "Order placed", order: newOrder });
};

export const getOrders = (_: Request, res: Response) => {
  res.json(orders);
};
