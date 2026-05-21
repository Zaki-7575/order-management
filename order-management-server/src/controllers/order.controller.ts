import { Request, Response } from "express";
import { createOrderService, getOrdersService, updateOrderStatusService } from "../services/order.service";
import { asyncHandler } from "../utils/asyncHandler";

export const createOrderController = asyncHandler(async (req: Request, res: Response) => {
  const order = await createOrderService(req.body);

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

export const getOrdersController = asyncHandler(async (req: Request, res: Response) => {
  const { store_id, page = "1", limit = "10" } = req.query;

  const result = await getOrdersService(
    store_id as string,
    Number(page),
    Number(limit)
  );

  return res.status(200).json({
    success: true,
    data: result.orders,
    pagination: result.pagination,
  });
});

export const updateOrderStatusController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const updatedOrder = await updateOrderStatusService(
    id as string, 
    status as "PLACED" | "PREPARING" | "COMPLETED"
  );

  return res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: updatedOrder,
  });
});
