const User = require('../models/User');
const { getUserResonances } = require('./resonanceController');

// GET /api/users/:handle — public profile by handle
const getProfile = async (req, res) => {
  const user = await User.findOne({ handle: req.params.handle });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: user.toPublicJSON() });
};

module.exports = { getProfile, getUserResonances };
