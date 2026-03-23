const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// POST /api/auth/signup
const signup = async (req, res) => {
  const { handle, email, password, primaryMood } = req.body;

  const existing = await User.findOne({ $or: [{ handle }, { email }] });
  if (existing) {
    const field = existing.handle === handle ? 'handle' : 'email';
    return res.status(409).json({ message: `That ${field} is already taken` });
  }

  const userData = { handle, email, password };
  if (primaryMood) userData.primaryMood = primaryMood;

  const user = await User.create(userData);
  const token = signToken(user._id);

  res.status(201).json({ token, user: user.toPublicJSON() });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(user._id);
  res.json({ token, user: user.toPublicJSON() });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
};

// PATCH /api/auth/me
const updateMe = async (req, res) => {
  const { bio, primaryMood } = req.body;
  const updates = {};
  if (bio !== undefined) updates.bio = bio;
  if (primaryMood !== undefined) updates.primaryMood = primaryMood;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({ user: user.toPublicJSON() });
};

module.exports = { signup, login, getMe, updateMe };
