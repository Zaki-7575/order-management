import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";

const prisma = new PrismaClient();

export const createItem = asyncHandler(async (req: Request, res: Response) => {
  const { name, category, price } = req.body;
  const item = await prisma.item.create({
    data: { name, category, price: parseFloat(price) },
  });
  res.status(201).json({ success: true, data: item });
});

export const getItems = asyncHandler(async (req: Request, res: Response) => {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json({ success: true, data: items });
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, category, price } = req.body;
  const item = await prisma.item.update({
    where: { id },
    data: { name, category, price: parseFloat(price) },
  });
  res.status(200).json({ success: true, data: item });
});

export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await prisma.item.delete({
    where: { id },
  });
  res.status(200).json({ success: true, message: "Item deleted successfully" });
});
