"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics.controller");
const router = (0, express_1.Router)();
router.post("/archive-old-orders", analytics_controller_1.archiveOldOrdersController);
router.get("/analytics/orders-per-day", analytics_controller_1.getOrdersPerDayController);
router.get("/analytics/revenue-per-store", analytics_controller_1.getRevenuePerStoreController);
router.get("/analytics/top-items", analytics_controller_1.getTopItemsController);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map