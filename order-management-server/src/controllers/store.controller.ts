import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";

const prisma = new PrismaClient();

export const createStore = asyncHandler(async (req: Request, res: Response) => {
  const { name, location } = req.body;
  const store = await prisma.store.create({
    data: { name, location },
  });
  res.status(201).json({ success: true, data: store });
});

export const getStores = asyncHandler(async (req: Request, res: Response) => {
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json({ success: true, data: stores });
});

export const updateStore = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, location } = req.body;
  const store = await prisma.store.update({
    where: { id },
    data: { name, location },
  });
  res.status(200).json({ success: true, data: store });
});

export const deleteStore = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await prisma.store.delete({
    where: { id },
  });
  res.status(200).json({ success: true, message: "Store deleted successfully" });
});
