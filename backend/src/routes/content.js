const { Router } = require('express');
const { body, query } = require('express-validator');
const { getFeed, getContent, createContent, deleteContent } = require('../controllers/contentController');
const { toggleResonate } = require('../controllers/resonanceController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const VALID_MOODS = ['dreamy', 'happy', 'calm', 'melancholy', 'energized', 'cozy', 'nostalgic', 'ethereal'];

const router = Router();

// Feed — auth optional (annotates resonated state when present)
router.get(
  '/',
  [
    query('mood').optional().isIn(VALID_MOODS),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
  ],
  validate,
  (req, res, next) => {
    // Soft auth — attach user if token present but don't block unauthenticated requests
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
      User.findById(decoded.id)
        .select('-password')
        .then((user) => { req.user = user; next(); })
        .catch(() => next());
    } catch {
      next();
    }
  },
  getFeed
);

router.get('/:id', getContent);

router.post(
  '/',
  protect,
  [
    body('videoUrl').isURL(),
    body('moodTags').isArray({ min: 1, max: 4 }),
    body('moodTags.*').isIn(VALID_MOODS),
    body('caption').optional().isLength({ max: 300 }),
    body('attributionUrl').optional({ nullable: true }).isURL(),
    body('isOriginal').optional().isBoolean(),
  ],
  validate,
  createContent
);

router.delete('/:id', protect, deleteContent);

// Resonate toggle
router.post('/:id/resonate', protect, toggleResonate);

module.exports = router;
