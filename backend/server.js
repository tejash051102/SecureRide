import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import agentRoutes from "./routes/agentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5175" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SecureRide API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/verifications", verificationRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  const server = app.listen(port, () => console.log(`Server running on port ${port}`));

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Stop the existing backend process or change PORT in backend/.env.`);
      process.exit(1);
    }

    throw error;
  });
});
