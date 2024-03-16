const jwt = require("jsonwebtoken");
const db = require("../model");
const Users = db.users;

const JWT_SECRET = process.env.JWT_SECRET;

const decodeToken = async (token, secret) => {
  return new Promise((resolve) => {
    try {
      if (!token) {
        return resolve({ message: "User not logged in.", success: false });
      }

      jwt.verify(token, secret, async (er, decode) => {
        if (er) {
          return resolve({
            message: "session expired login again.",
            success: false,
          });
        }

        if (decode) {
          return resolve({
            message: "valid token",
            success: true,
            decoded: decode,
          });
        }

        return resolve({
          message: "session expired login again.",
          success: false,
        });
      });
    } catch (error) {
      return resolve({
        message: "session expired.",
        success: false,
        error: error.message,
      });
    }
  });
};

module.exports = async (req, res, next) => {
  let token = req.headers["authorization"];
  try {
    if (!token) {
      return res.json({
        success: false,
        message: "No Token provided",
      });
    }

    let decoded = await decodeToken(token, JWT_SECRET);
    if (!decoded.success) {
      return res.json({ ...decoded, inValidToken: true });
    }
    const { email, name, id } = decoded.decoded.dataValues;

    const user = await Users.findByPk(Number(id));

    if (user) {
      req.user = user;
      next();
    } else {
      return res.json({ success: false, message: "No User found" });
    }
  } catch (err) {
    return res.json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};
