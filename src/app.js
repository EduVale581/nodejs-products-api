import express from "express";
import cors from "cors";

import productRoutes from "./routes/product.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/products", productRoutes);

app.use("/health", healthRoutes);

export default app;
