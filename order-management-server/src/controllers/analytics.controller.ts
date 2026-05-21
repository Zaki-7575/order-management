import { Request, Response } from "express";
import {
  archiveOldOrdersService,
  getOrdersPerDayService,
  getRevenuePerStoreService,
  getTopItemsService,
} from "../services/analytics.service";
import { asyncHandler } from "../utils/asyncHandler";

export const archiveOldOrdersController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await archiveOldOrdersService();
    return res.status(200).json({
      success: true,
      message: `${result.count} orders archived successfully`,
      data: result,
    });
  }
);

export const getOrdersPerDayController = asyncHandler(
  async (req: Request, res: Response) => {
    const type = req.query.type as string;
    const result = await getOrdersPerDayService(type);
    
    // Convert BigInt to Number for JSON serialization (Prisma RAW COUNT returns BigInt)
    const formattedResult = (result as any[]).map(row => ({
      date: row.date,
      count: Number(row.count),
    }));

    return res.status(200).json({
      success: true,
      data: formattedResult,
    });
  }
);

export const getRevenuePerStoreController = asyncHandler(
  async (req: Request, res: Response) => {
    const type = req.query.type as string;
    const result = await getRevenuePerStoreService(type);
    return res.status(200).json({
      success: true,
      data: result,
    });
  }
);

export const getTopItemsController = asyncHandler(
  async (req: Request, res: Response) => {
    const type = req.query.type as string;
    const result = await getTopItemsService(type);
    return res.status(200).json({
      success: true,
      data: result,
    });
  }
);
