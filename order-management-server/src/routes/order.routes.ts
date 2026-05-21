import { Router } from "express";

import {
  createOrderController,
  getOrdersController,
  updateOrderStatusController,
} from "../controllers/order.controller";

import { validate } from "../middlewares/validate.middleware";

import { createOrderSchema } from "../validations/order.validation";

const router = Router();

router.post(
  "/",
  validate(createOrderSchema),
  createOrderController
);

router.get("/", getOrdersController);

router.patch("/:id/status", updateOrderStatusController);

export default router;