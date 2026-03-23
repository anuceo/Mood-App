const { Router } = require('express');
const { body } = require('express-validator');
const {
  getMyBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  addContentToBoard,
  removeContentFromBoard,
} = require('../controllers/boardController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const VALID_MOODS = ['dreamy', 'happy', 'calm', 'melancholy', 'energized', 'cozy', 'nostalgic', 'ethereal'];

const router = Router();

router.get('/', protect, getMyBoards);
router.get('/:id', protect, getBoard);

router.post(
  '/',
  protect,
  [
    body('name').trim().isLength({ min: 1, max: 60 }),
    body('primaryMood').optional().isIn(VALID_MOODS),
    body('description').optional().isLength({ max: 200 }),
    body('isPublic').optional().isBoolean(),
  ],
  validate,
  createBoard
);

router.patch(
  '/:id',
  protect,
  [
    body('name').optional().trim().isLength({ min: 1, max: 60 }),
    body('primaryMood').optional().isIn(VALID_MOODS),
    body('description').optional().isLength({ max: 200 }),
    body('isPublic').optional().isBoolean(),
  ],
  validate,
  updateBoard
);

router.delete('/:id', protect, deleteBoard);

router.post('/:id/content/:contentId', protect, addContentToBoard);
router.delete('/:id/content/:contentId', protect, removeContentFromBoard);

module.exports = router;
