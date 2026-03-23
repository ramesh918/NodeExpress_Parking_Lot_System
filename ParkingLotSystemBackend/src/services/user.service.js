const User = require("../models/User.model");
const ApiError = require("../utils/apiError");
const { signToken } = require("../utils/jwt");


exports.createUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already exists");

  const user = await User.create({ name, email, password, role });

 const userObj = user.toObject();   // convert from mongoose doc
 delete userObj.password;          // now delete works

  return userObj;
};

exports.getUsers = async () => {
  return User.find().sort({ createdAt: -1 });
};

exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

exports.updateUser = async (id, updates) => {
  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new ApiError(404, "User not found");
  return user;
};

exports.deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApiError(404, "User not found");
  return true;
};


exports.loginUser = async ({ email, password }) => {
  // 1) find user + include password (because select:false)
  const user = await User.findOne({ email }).select("password");
  if (!user) {
    const err = new Error("User not existed");
    err.statusCode = 401;
    throw err;
  }

  // 2) compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  // 3) create token
  const token = signToken({ userId: user._id, role: user.role });

  // 4) return safe user data (no password)
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

