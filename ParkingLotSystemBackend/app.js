const express = require("express");
const path = require("path");
const app = express();

const userRoutes = require("./src/routes/user.routes");
const authRoutes = require("./src/routes/auth.routes");
const roleAccessRoutes = require("./src/routes/roleAccess.routes");
const resourceRoutes = require("./src/routes/resource.routes");
const parkingLotRoutes = require("./src/routes/parkingLot.routes");
const parkingSpotRoutes = require("./src/routes/parkingSpot.routes");
const vehicleRoutes = require("./src/routes/vehicle.routes");
const ticketRoutes = require("./src/routes/ticket.routes");
const feeRoutes = require("./src/routes/fee.routes");
const invoiceRoutes = require("./src/routes/invoice.routes");
const errorMiddleware = require("./src/middleware/error.middleware");

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/role-access", roleAccessRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/parking-lots", parkingLotRoutes);
app.use("/api/parking-spots", parkingSpotRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/invoices", invoiceRoutes);

// error handler (last)
app.use(errorMiddleware);

// Serve React frontend (must be after all API routes)
const frontendDist = path.join(__dirname, "../ParkingLotSystemFrontend/dist");
app.use(express.static(frontendDist));
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

module.exports = app;