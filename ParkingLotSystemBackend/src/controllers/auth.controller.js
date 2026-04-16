const userService = require("../services/user.service");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const data = await userService.loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login };
