"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopItemsController = exports.getRevenuePerStoreController = exports.getOrdersPerDayController = exports.archiveOldOrdersController = void 0;
const analytics_service_1 = require("../services/analytics.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.archiveOldOrdersController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, analytics_service_1.archiveOldOrdersService)();
    return res.status(200).json({
        success: true,
        message: `${result.count} orders archived successfully`,
        data: result,
    });
});
exports.getOrdersPerDayController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const type = req.query.type;
    const result = await (0, analytics_service_1.getOrdersPerDayService)(type);
    // Convert BigInt to Number for JSON serialization (Prisma RAW COUNT returns BigInt)
    const formattedResult = result.map(row => ({
        date: row.date,
        count: Number(row.count),
    }));
    return res.status(200).json({
        success: true,
        data: formattedResult,
    });
});
exports.getRevenuePerStoreController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const type = req.query.type;
    const result = await (0, analytics_service_1.getRevenuePerStoreService)(type);
    return res.status(200).json({
        success: true,
        data: result,
    });
});
exports.getTopItemsController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const type = req.query.type;
    const result = await (0, analytics_service_1.getTopItemsService)(type);
    return res.status(200).json({
        success: true,
        data: result,
    });
});
//# sourceMappingURL=analytics.controller.js.map