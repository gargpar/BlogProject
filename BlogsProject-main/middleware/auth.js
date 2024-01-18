const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    //Token
    const token =
      req.body.token ||
      req.cookies.Token
    //   req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.json({
        success: false,
        message: "Token not Found",
      });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

exports.isUser = async (req, res, next) => {
  try {
    if (req.user.role != "User") {
      return res.status(401).json({
        success: false,
        message: "You arent a Student",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role not matching",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role != "Admin") {
      return res.status(401).json({
        success: false,
        message: "You arent a Admin",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role not matching",
    });
  }
};
