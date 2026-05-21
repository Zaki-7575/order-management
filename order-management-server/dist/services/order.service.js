"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusService = exports.getOrdersService = exports.createOrderService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const socket_1 = require("../config/socket");
const createOrderService = async (data) => {
    const order = await prisma_1.default.order.create({
        data: {
            store_id: data.store_id,
            total_amount: data.total_amount,
            items: {
                create: data.items,
            },
        },
        include: {
            items: true,
        },
    });
    try {
        const io = (0, socket_1.getIO)();
        io.to(`store_${order.store_id}`).emit("new_order", order);
        io.emit("new_order", order); // Also broadcast to everyone just in case
    }
    catch (error) {
        console.error("Socket emit new_order failed", error);
    }
    return order;
};
exports.createOrderService = createOrderService;
const getOrdersService = async (store_id, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const whereCondition = store_id
        ? {
            store_id,
        }
        : {};
    const [orders, total] = await Promise.all([
        prisma_1.default.order.findMany({
            where: whereCondition,
            include: {
                items: true,
            },
            orderBy: {
                created_at: "desc",
            },
            skip,
            take: limit,
        }),
        prisma_1.default.order.count({
            where: whereCondition,
        }),
    ]);
    return {
        orders,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getOrdersService = getOrdersService;
const updateOrderStatusService = async (id, status) => {
    const existingOrder = await prisma_1.default.order.findUnique({
        where: { id },
    });
    if (!existingOrder) {
        throw new Error("Order not found");
    }
    const updatedOrder = await prisma_1.default.order.update({
        where: {
            id,
        },
        data: {
            status,
        },
        include: {
            items: true,
        },
    });
    try {
        const io = (0, socket_1.getIO)();
        io.to(`store_${updatedOrder.store_id}`).emit("order_status_updated", updatedOrder);
        io.emit("order_status_updated", updatedOrder); // Also broadcast to everyone just in case
    }
    catch (error) {
        console.error("Socket emit order_status_updated failed", error);
    }
    return updatedOrder;
};
exports.updateOrderStatusService = updateOrderStatusService;
//# sourceMappingURL=order.service.js.map