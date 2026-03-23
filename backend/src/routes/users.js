const { Router } = require('express');
const { query } = require('express-validator');
const { getProfile, getUserResonances } = require('../controllers/userController');
const { validate } = require('../middleware/validate');

const router = Router();

// GET /api/users/:handle — public profile
router.get('/:handle', getProfile);

// GET /api/users/:handle/resonances — paginated content a user has resonated with
router.get(
  '/:handle/resonances',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
  ],
  validate,
  async (req, res) => {
    // Resolve handle to userId then delegate
    const User = require('../models/User');
    const user = await User.findOne({ handle: req.params.handle });
    if (!user) return res.status(404).json({ message: 'User not found' });
    req.params.userId = user._id.toString();
    return getUserResonances(req, res);
  }
);

module.exports = router;
