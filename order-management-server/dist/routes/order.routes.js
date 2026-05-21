"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const order_validation_1 = require("../validations/order.validation");
const router = (0, express_1.Router)();
router.post("/", (0, validate_middleware_1.validate)(order_validation_1.createOrderSchema), order_controller_1.createOrderController);
router.get("/", order_controller_1.getOrdersController);
router.patch("/:id/status", order_controller_1.updateOrderStatusController);
exports.default = router;
//# sourceMappingURL=order.routes.js.map