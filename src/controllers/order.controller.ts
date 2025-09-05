import { Request, Response } from "express";
import {
  createOrder,
  listOrders,
  getOrder,
  payOrder,
} from "../services/order.service";

export async function create(req: Request, res: Response) {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Create order failed" });
  }
}

export async function list(req: Request, res: Response) {
  const orders = await listOrders();
  res.json(orders);
}

export async function getOne(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const order = await getOrder(id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}

export async function pay(req: Request, res: Response) {
  try {
    const { orderId: id, callback_url } = req.body as {
      callback_url?: string;
      orderId: string;
    };
    const updated = await payOrder(id);
    res.json({ callback_url, updated });
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Pay order failed" });
  }
}
