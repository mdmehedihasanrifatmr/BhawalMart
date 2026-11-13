import express from "express";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import {connectDB} from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";

import productRoutes from "./routes/productRoutes.js";

import { PORT, MAX_JSON_SIZE, CLIENT_URL } from "./config/config.js";


import errorHandler from "./middlewares/errorHandler.js";

import mongoose from "mongoose";

import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

const app = express();

// Security headers
app.use(helmet());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: MAX_JSON_SIZE,
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: MAX_JSON_SIZE,
  }),
);

app.use(cookieParser());

app.use(hpp());

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 100,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);


app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

//Routes

app.use("/api/auth", authRoutes);
app.use("/api/product",productRoutes);
app.use("/api/category",categoryRoutes);
app.use("/api/brand",brandRoutes);

// app.use("/api/patients",patientRoutes);
//404 error handling

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

//global error handling

app.use(errorHandler);

//start server

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        console.log("HTTP server closed.");

        try {
          await mongoose.connection.close();

          console.log("MongoDB connection closed.");

          process.exit(0);
        } catch (error) {
          console.error("Error closing MongoDB:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    server.on("error", (error) => {
      console.error("HTTP Server Error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:", error);

  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("UNHANDLED REJECTION:", error);

  process.exit(1);
});

startServer();
