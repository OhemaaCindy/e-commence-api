import { Request, Response } from "express";

import { createAddress, listAddress } from "../services/address.service";

export async function addAddress(req: Request, res: Response) {
  const userId = req?.user?.id;
  try {
    const address = await createAddress(userId!, req.body);
    res.status(201).json(address);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Create address failed" });
  }
}

export async function getAllAddress(req: Request, res: Response) {
  const userId = req?.user?.id;
  const address = await listAddress(userId!);
  res.json(address);
}
