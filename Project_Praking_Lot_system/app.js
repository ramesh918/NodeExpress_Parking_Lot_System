const express = require("express");
const app = express();

const userRoutes = require("./src/routes/user.routes");
const errorMiddleware = require("./src/middleware/error.middleware");
const authRoutes = require("./src/routes/auth.routes");

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// routes
app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

// error handler (last)
app.use(errorMiddleware);

module.exports = app;


// middleware 
// routes 
// error hanlding 