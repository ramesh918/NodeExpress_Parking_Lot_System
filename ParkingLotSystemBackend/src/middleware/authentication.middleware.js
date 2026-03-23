const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/User.model");

const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Get token from Authorization header
    // Format: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Token missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // decoded = { userId, role, iat, exp }

    // 3️⃣ Get user from DB (optional but recommended)
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    // 4️⃣ Attach user info to request object
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
