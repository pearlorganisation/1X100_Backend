import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"; // Import cookie-parser

import productRouter from "./src/routes/product/ProductRoutes.js";
import authRouter from "./src/routes/auth/authroutes.js";
import rechargerouter from "./src/routes/order/OrderRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form-encoded data

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.CLIENT_URL
      : [
          "http://localhost:5173",
          "http://localhost:5174",
          "http://localhost:5175",
        ],
  credentials: true, // Allow cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Apply CORS middleware
// Middleware to parse JSON bodies

app.use(cookieParser()); // Middleware to parse cookies

app.use(morgan("tiny"));
// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(`DB connection error: ${err}`));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/recharge", rechargerouter);
app.use("/api/v1/products", productRouter);
// Default Route
app.get("/", (req, res) => {
  console.log("Default route accessed!");
  res.send("Welcome to the API!");
});

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
