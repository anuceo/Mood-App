const Board = require('../models/Board');
const Content = require('../models/Content');

// GET /api/boards — all boards for the authenticated user
const getMyBoards = async (req, res) => {
  const boards = await Board.find({ userId: req.user._id }).sort({ updatedAt: -1 });
  res.json({ boards });
};

// GET /api/boards/:id — single board with populated content
const getBoard = async (req, res) => {
  const board = await Board.findById(req.params.id).populate('contentIds');
  if (!board) return res.status(404).json({ message: 'Board not found' });

  const isOwner = board.userId.toString() === req.user?._id?.toString();
  if (!board.isPublic && !isOwner) {
    return res.status(403).json({ message: 'This board is private' });
  }

  res.json({ board });
};

// POST /api/boards — create a new board
const createBoard = async (req, res) => {
  const { name, primaryMood, description, isPublic } = req.body;

  const board = await Board.create({
    userId: req.user._id,
    name,
    primaryMood: primaryMood || 'dreamy',
    description: description || '',
    isPublic: isPublic !== false,
  });

  res.status(201).json({ board });
};

// PATCH /api/boards/:id — update board metadata
const updateBoard = async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) return res.status(404).json({ message: 'Board not found' });
  if (board.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { name, primaryMood, description, isPublic } = req.body;
  if (name !== undefined) board.name = name;
  if (primaryMood !== undefined) board.primaryMood = primaryMood;
  if (description !== undefined) board.description = description;
  if (isPublic !== undefined) board.isPublic = isPublic;

  await board.save();
  res.json({ board });
};

// DELETE /api/boards/:id
const deleteBoard = async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) return res.status(404).json({ message: 'Board not found' });
  if (board.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await board.deleteOne();
  res.json({ message: 'Board deleted' });
};

// POST /api/boards/:id/content/:contentId — add content to a board
const addContentToBoard = async (req, res) => {
  const board = await Board.findOne({ _id: req.params.id, userId: req.user._id });
  if (!board) return res.status(404).json({ message: 'Board not found' });

  const content = await Content.findById(req.params.contentId);
  if (!content) return res.status(404).json({ message: 'Content not found' });

  await Board.findByIdAndUpdate(req.params.id, {
    $addToSet: { contentIds: req.params.contentId },
  });

  res.json({ message: 'Content added to board' });
};

// DELETE /api/boards/:id/content/:contentId — remove content from a board
const removeContentFromBoard = async (req, res) => {
  const board = await Board.findOne({ _id: req.params.id, userId: req.user._id });
  if (!board) return res.status(404).json({ message: 'Board not found' });

  await Board.findByIdAndUpdate(req.params.id, {
    $pull: { contentIds: req.params.contentId },
  });

  res.json({ message: 'Content removed from board' });
};

module.exports = { getMyBoards, getBoard, createBoard, updateBoard, deleteBoard, addContentToBoard, removeContentFromBoard };
