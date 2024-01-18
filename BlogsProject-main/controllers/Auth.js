const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signUp = async (req, res) => {
  try {
    const { name, password, email, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (!name || !password || !email || !role) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.send(500).json({
        success: false,
        message: "Error in hashed password",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.json({
      success: true,
      messsage: "User Created",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User cant be registered, please try again later",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(409).json({
        success: false,
        message: "Fill all the fields",
      });
    }

    let user = await User.findOne({ email }).populate("blogs").exec();

    if (!user) {
      return res.status(409).json({
        success: false,
        message: "User is not registered",
      });
    }

    const payload = {
      name:user.name,
      email: user.email,
      id: user._id,
      role: user.role,
    };

    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("Token", token, options).json({
        success: true,
        token,
        user,
        message: "User is Logged in",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User cant get logged in",
    });
  }
};
