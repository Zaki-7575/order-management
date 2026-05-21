"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_controller_1 = require("../controllers/store.controller");
const router = (0, express_1.Router)();
router.post("/", store_controller_1.createStore);
router.get("/", store_controller_1.getStores);
router.put("/:id", store_controller_1.updateStore);
router.delete("/:id", store_controller_1.deleteStore);
exports.default = router;
//# sourceMappingURL=store.routes.js.map