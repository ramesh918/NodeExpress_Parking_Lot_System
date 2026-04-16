// src/server.js
const http = require("http");
const app = require("./app");
const config = require("./src/config/config");
const connectDB = require("./src/config/db");

// Connect Database
connectDB();

const server = http.createServer(app);

// Start Server
server.listen(config.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${config.PORT}`);
});

