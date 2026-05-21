"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusController = exports.getOrdersController = exports.createOrderController = void 0;
const order_service_1 = require("../services/order.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.createOrderController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const order = await (0, order_service_1.createOrderService)(req.body);
    return res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
    });
});
exports.getOrdersController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { store_id, page = "1", limit = "10" } = req.query;
    const result = await (0, order_service_1.getOrdersService)(store_id, Number(page), Number(limit));
    return res.status(200).json({
        success: true,
        data: result.orders,
        pagination: result.pagination,
    });
});
exports.updateOrderStatusController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await (0, order_service_1.updateOrderStatusService)(id, status);
    return res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: updatedOrder,
    });
});
//# sourceMappingURL=order.controller.js.map