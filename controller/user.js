const db = require("../model");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const User = db.users;

const createJWT = async (data, secret) => {
  return new Promise(async (resolve) => {
    try {
      let token = await jwt.sign({ ...data }, secret, { expiresIn: "12h" });
      if (token) {
        return resolve({ success: true, signedData: token });
      }
      return resolve({ success: false, message: token });
    } catch (error) {
      return resolve({ success: false, message: error.message });
    }
  });
};

const getAllUsers = async (req, res) => {
  const users = await User.findAll({ where: null });
  return res.json({
    success: true,
    data: users,
  });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and Password cannot be blank",
      });
    }
    const user = await User.findOne({
      where: { email: email, password: password },
    });
    if (user) {
      let token = await createJWT(user, JWT_SECRET);
      if (!token.signedData) {
        return res.json({
          success: false,
          message: "login failed.",
          error: token.message,
        });
      }
      return res.json({
        success: true,
        message: "login success.",
        token: token.signedData,
        data: user,
      });
    } else {
      return res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    return res.json({
      success: false,
      message: "Some internal error occurred..",
      error: err.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.json({
        success: false,
        message: "Email, Password and name cannot be blank",
      });
    }
    const oldUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (oldUser) {
      return res.json({ success: false, message: "Email already exists" });
    }
    const user = {
      name: name,
      email: email,
      password: password,
    };

    const data = await User.create(user);
    let token = await createJWT(data, JWT_SECRET);
    if (!token.signedData) {
      return res.json({
        success: false,
        message: "Signup failed.",
        error: token.message,
      });
    }
    res.json({
      success: true,
      data: data,
      token: token.signedData,
      message: "User created successfully",
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message || "Some internal error occurred..",
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  loginUser,
};
