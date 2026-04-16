const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authentication.middleware")

router.post("/login", authController.login);
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Profile data",
    user: req.user,
  });
});

module.exports = router;
