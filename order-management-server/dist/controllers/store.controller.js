"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStore = exports.updateStore = exports.getStores = exports.createStore = void 0;
const client_1 = require("@prisma/client");
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma = new client_1.PrismaClient();
exports.createStore = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, location } = req.body;
    const store = await prisma.store.create({
        data: { name, location },
    });
    res.status(201).json({ success: true, data: store });
});
exports.getStores = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const stores = await prisma.store.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: stores });
});
exports.updateStore = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { name, location } = req.body;
    const store = await prisma.store.update({
        where: { id },
        data: { name, location },
    });
    res.status(200).json({ success: true, data: store });
});
exports.deleteStore = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    await prisma.store.delete({
        where: { id },
    });
    res.status(200).json({ success: true, message: "Store deleted successfully" });
});
//# sourceMappingURL=store.controller.js.map