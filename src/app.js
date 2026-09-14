import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import catalogRoutes from "./routes/catalogRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
const allowedOrigins = [
  "http://localhost:5173",
  "https://market-place-frontend-five.vercel.app",
];

app.use(cors({
  origin: allowedOrigins,
}));
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiados intentos, intenta de nuevo más tarde" },
});

app.use("/auth",authLimiter, authRoutes);
app.use("/catalogs", catalogRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API del marketplace funcionando 🚀" });
});

app.use(errorHandler);

export default app;