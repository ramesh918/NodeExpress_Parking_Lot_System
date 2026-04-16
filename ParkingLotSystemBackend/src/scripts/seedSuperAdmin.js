require("dotenv").config();

const mongoose = require("mongoose");
const config = require("../config/config");
const User = require("../models/User.model");

const SUPER_ADMIN = {
  name: process.env.SUPER_ADMIN_NAME || "Super Admin",
  email: process.env.SUPER_ADMIN_EMAIL || "superadmin@parkingsystem.com",
  password: process.env.SUPER_ADMIN_PASSWORD || "SuperSecret123!",
  role: "SUPER_ADMIN",
};

async function seedSuperAdmin() {
  await mongoose.connect(config.MONGO_URI);
  console.log("Connected to MongoDB");

  const existing = await User.findOne({ role: "SUPER_ADMIN" });

  if (existing) {
    console.log(`Super admin already exists: ${existing.email}`);
    await mongoose.disconnect();
    process.exit(0);
  }

  await User.create(SUPER_ADMIN);

  console.log(`Super admin created successfully`);
  console.log(`  Email   : ${SUPER_ADMIN.email}`);
  console.log(`  Password: ${SUPER_ADMIN.password}`);

  await mongoose.disconnect();
  process.exit(0);
}

seedSuperAdmin().catch((err) => {
  console.error("Seed failed:", err.message);
  mongoose.disconnect();
  process.exit(1);
});
