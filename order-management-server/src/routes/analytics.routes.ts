import { Router } from "express";
import {
  archiveOldOrdersController,
  getOrdersPerDayController,
  getRevenuePerStoreController,
  getTopItemsController,
} from "../controllers/analytics.controller";

const router = Router();

router.post("/archive-old-orders", archiveOldOrdersController);
router.get("/analytics/orders-per-day", getOrdersPerDayController);
router.get("/analytics/revenue-per-store", getRevenuePerStoreController);
router.get("/analytics/top-items", getTopItemsController);

export default router;
