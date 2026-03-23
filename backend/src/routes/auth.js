const { Router } = require('express');
const { body } = require('express-validator');
const { signup, login, getMe, updateMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();

router.post(
  '/signup',
  [
    body('handle').trim().isLength({ min: 2, max: 30 }).matches(/^[a-z0-9._]+$/i),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  validate,
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  login
);

router.get('/me', protect, getMe);

router.patch(
  '/me',
  protect,
  [
    body('bio').optional().isLength({ max: 160 }),
    body('primaryMood').optional().isIn(['dreamy', 'happy', 'calm', 'melancholy', 'energized', 'cozy', 'nostalgic', 'ethereal']),
  ],
  validate,
  updateMe
);

module.exports = router;
