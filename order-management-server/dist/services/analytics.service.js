"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopItemsService = exports.getRevenuePerStoreService = exports.getOrdersPerDayService = exports.archiveOldOrdersService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const archiveOldOrdersService = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const oldOrders = await prisma_1.default.order.findMany({
        where: {
            created_at: {
                lt: thirtyDaysAgo,
            },
        },
        include: {
            items: true,
        },
    });
    if (oldOrders.length === 0) {
        return { count: 0 };
    }
    // Insert into archive tables
    for (const order of oldOrders) {
        await prisma_1.default.orderArchive.create({
            data: {
                id: order.id,
                store_id: order.store_id,
                total_amount: order.total_amount,
                status: order.status,
                created_at: order.created_at,
                items: {
                    create: order.items.map(item => ({
                        id: item.id,
                        item_id: item.item_id,
                        qty: item.qty,
                    })),
                },
            },
        });
    }
    // Delete from main tables
    const deleted = await prisma_1.default.order.deleteMany({
        where: {
            id: {
                in: oldOrders.map(o => o.id),
            },
        },
    });
    return { count: deleted.count };
};
exports.archiveOldOrdersService = archiveOldOrdersService;
const getOrdersPerDayService = async (type = 'active') => {
    if (type === 'archived') {
        return await prisma_1.default.$queryRaw `
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM "OrderArchive"
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
    }
    return await prisma_1.default.$queryRaw `
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM "Order"
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `;
};
exports.getOrdersPerDayService = getOrdersPerDayService;
const getRevenuePerStoreService = async (type = 'active') => {
    const model = type === 'archived' ? prisma_1.default.orderArchive : prisma_1.default.order;
    const result = await model.groupBy({
        by: ['store_id'],
        _sum: {
            total_amount: true,
        },
        orderBy: {
            _sum: {
                total_amount: 'desc',
            },
        },
    });
    return result.map((item) => ({
        store_id: item.store_id,
        revenue: item._sum.total_amount,
    }));
};
exports.getRevenuePerStoreService = getRevenuePerStoreService;
const getTopItemsService = async (type = 'active') => {
    const model = type === 'archived' ? prisma_1.default.orderItemArchive : prisma_1.default.orderItem;
    const result = await model.groupBy({
        by: ['item_id'],
        _sum: {
            qty: true,
        },
        orderBy: {
            _sum: {
                qty: 'desc',
            },
        },
        take: 5,
    });
    return result.map((item) => ({
        item_id: item.item_id,
        total_qty: item._sum.qty,
    }));
};
exports.getTopItemsService = getTopItemsService;
//# sourceMappingURL=analytics.service.js.map