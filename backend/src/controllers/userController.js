const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "60s",
    // expiresIn: "1d",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id, isRefreshToken: true }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
};

const isEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const isUrl = (url) => {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return urlRegex.test(url);
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, password, email, profilePictureUrl } = req.body;

  if (!username || username === "") {
    return res.status(400).json({ message: "Username is required" });
  }
  if (username.length < 3) {
    return res
      .status(400)
      .json({ message: "Username must be at least 3 characters long" });
  }

  if (!password || password === "") {
    return res.status(400).json({ message: "Password is required" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  if (!email || email === "") {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (profilePictureUrl && !isUrl(profilePictureUrl)) {
    return res.status(400).json({ message: "Invalid profile picture URL" });
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    // Create user
    const user = await User.create({
      username,
      password,
      email,
      profilePictureUrl,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
        token: generateToken(user._id),
        refreshToken: generateRefreshToken(user._id),
        expiresIn: "1d",
        refreshTokenExpiresIn: "30d",
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  if (!req.body.username || req.body.username === "") {
    return res.status(400).json({ message: "Username is required" });
  }

  if (!req.body.password || req.body.password === "") {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const { username, password } = req.body;

    // Check for user
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
        refreshToken: generateRefreshToken(user._id),
        expiresIn: "1d",
        refreshTokenExpiresIn: "30d",
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      { username: 1, _id: 1, profilePictureUrl: 1 }
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  if (!req.params.id || req.params.id === "") {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await User.findById(req.params.id, {
      username: 1,
      _id: 1,
      profilePictureUrl: 1,
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  console.log("refresh called");
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  console.log(decoded);
  if(decoded.isRefreshToken){
    const user = await User.findById(decoded.id);
    res.json({ token: generateToken(user._id) });
  }else{
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  getUserById,
  refreshToken,
};
