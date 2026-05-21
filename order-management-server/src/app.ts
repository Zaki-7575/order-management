import express from "express";
import cors from "cors";

import orderRoutes from "./routes/order.routes";
import analyticsRoutes from "./routes/analytics.routes";
import storeRoutes from "./routes/store.routes";
import itemRoutes from "./routes/item.routes";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/orders", orderRoutes);
app.use("/stores", storeRoutes);
app.use("/items", itemRoutes);
app.use("/", analyticsRoutes);

app.use(globalErrorHandler);

export default app;