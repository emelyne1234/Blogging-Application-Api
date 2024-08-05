import express, { Request, Response } from "express";
import "express-async-errors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import * as swaggerui from "swagger-ui-express";
import userRoutes from "./routes/userRoutes";
import blogRoutes from "./routes/blogRoutes";
import authRoutes from "./routes/authRoutes";
import commentRoutes from "./routes/commentRoutes";
import swaggerdocs from "./docs/swaggerdocs";
import logger from "./logs/config";
import { metricsMiddleware, metricsEndpoint } from "./middlewares/metrics";

//getting env variables
dotenv.config();
const { mongo_url, mongo_url_test, PORT } = process.env;

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(metricsMiddleware);

app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/docs", swaggerui.serve, swaggerui.setup(swaggerdocs));
app.use("/uploads", express.static("uploads"));
app.get("/metrics", metricsEndpoint);
app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "route not found" });
});

mongoose
  .connect(mongo_url!)
  .then(() => {
    logger.info("Connected to the database");
  })
  .catch((e) => logger.error((e as Error).message));

const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = server;
