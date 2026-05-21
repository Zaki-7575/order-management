"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.getItems = exports.createItem = void 0;
const client_1 = require("@prisma/client");
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma = new client_1.PrismaClient();
exports.createItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, category, price } = req.body;
    const item = await prisma.item.create({
        data: { name, category, price: parseFloat(price) },
    });
    res.status(201).json({ success: true, data: item });
});
exports.getItems = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const items = await prisma.item.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: items });
});
exports.updateItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { name, category, price } = req.body;
    const item = await prisma.item.update({
        where: { id },
        data: { name, category, price: parseFloat(price) },
    });
    res.status(200).json({ success: true, data: item });
});
exports.deleteItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    await prisma.item.delete({
        where: { id },
    });
    res.status(200).json({ success: true, message: "Item deleted successfully" });
});
//# sourceMappingURL=item.controller.js.map