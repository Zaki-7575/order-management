"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    store_id: zod_1.z.string().min(1, "Store ID is required"),
    total_amount: zod_1.z.number().positive(),
    items: zod_1.z
        .array(zod_1.z.object({
        item_id: zod_1.z.string().min(1),
        qty: zod_1.z.number().min(1),
    }))
        .min(1, "At least one item is required"),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        "PLACED",
        "PREPARING",
        "COMPLETED",
    ]),
});
//# sourceMappingURL=order.validation.js.map