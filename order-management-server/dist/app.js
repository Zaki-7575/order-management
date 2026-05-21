"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const store_routes_1 = __importDefault(require("./routes/store.routes"));
const item_routes_1 = __importDefault(require("./routes/item.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("API Running...");
});
app.use("/orders", order_routes_1.default);
app.use("/stores", store_routes_1.default);
app.use("/items", item_routes_1.default);
app.use("/", analytics_routes_1.default);
app.use(error_middleware_1.globalErrorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map