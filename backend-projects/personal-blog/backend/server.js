import "dotenv/config";
import express from "express";

// Import Routes
import adminRoutes from "./src/routes/adminRoutes.js";
import guestRoutes from "./src/routes/guestRoutes.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin routes
app.use("/admin", adminRoutes);

// Guest routes
app.use("/", guestRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running successfully on PORT: ${PORT}`);
});

//  Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    // await disconnectDB(); // change to db.json
    process.exit(1);
  });
});

// Handle uncaught exception
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  // await disconnectDB();
  process.exit(1);
});

// Graceful Shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM recieved, shutting down gracefully");
  server.close(async () => {
    // await disconnectDB();
    process.exit(0);
  });
});