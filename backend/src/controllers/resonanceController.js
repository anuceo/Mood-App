const Resonance = require('../models/Resonance');
const Content = require('../models/Content');
const Board = require('../models/Board');

// POST /api/content/:id/resonate — toggle resonance on/off
const toggleResonate = async (req, res) => {
  const { id: contentId } = req.params;
  const { boardId } = req.body; // optional

  const content = await Content.findById(contentId);
  if (!content) return res.status(404).json({ message: 'Content not found' });

  const existing = await Resonance.findOne({ userId: req.user._id, contentId });

  if (existing) {
    // Un-resonate: remove record and decrement count
    await Promise.all([
      existing.deleteOne(),
      Content.findByIdAndUpdate(contentId, { $inc: { resonanceCount: -1 } }),
    ]);
    return res.json({ resonated: false, resonanceCount: content.resonanceCount - 1 });
  }

  // Resonate: create record and increment count
  const resonanceData = { userId: req.user._id, contentId };
  if (boardId) {
    const board = await Board.findOne({ _id: boardId, userId: req.user._id });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    resonanceData.boardId = boardId;
    // Also add content to the board if not already present
    await Board.findByIdAndUpdate(boardId, { $addToSet: { contentIds: contentId } });
  }

  await Promise.all([
    Resonance.create(resonanceData),
    Content.findByIdAndUpdate(contentId, { $inc: { resonanceCount: 1 } }),
  ]);

  return res.json({ resonated: true, resonanceCount: content.resonanceCount + 1 });
};

// GET /api/users/:handle/resonances — all content a user has resonated with
const getUserResonances = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const resonances = await Resonance.find({ userId: req.params.userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('contentId');

  const items = resonances.map((r) => r.contentId).filter(Boolean);
  res.json({ items });
};

module.exports = { toggleResonate, getUserResonances };
