const Content = require('../models/Content');
const Resonance = require('../models/Resonance');
const User = require('../models/User');

// GET /api/content — paginated feed, optional mood filter
const getFeed = async (req, res) => {
  const { mood, page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const query = mood ? { moodTags: mood } : {};

  const [items, total] = await Promise.all([
    Content.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Content.countDocuments(query),
  ]);

  // If an authenticated user is present, annotate which items they've resonated with
  let resonatedIds = new Set();
  if (req.user) {
    const resonances = await Resonance.find({
      userId: req.user._id,
      contentId: { $in: items.map((i) => i._id) },
    }).select('contentId');
    resonatedIds = new Set(resonances.map((r) => r.contentId.toString()));
  }

  const annotated = items.map((item) => ({
    ...item.toObject(),
    resonated: resonatedIds.has(item._id.toString()),
  }));

  res.json({
    items: annotated,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
};

// GET /api/content/:id
const getContent = async (req, res) => {
  const content = await Content.findById(req.params.id);
  if (!content) return res.status(404).json({ message: 'Content not found' });

  let resonated = false;
  if (req.user) {
    const r = await Resonance.findOne({ userId: req.user._id, contentId: content._id });
    resonated = Boolean(r);
  }

  res.json({ ...content.toObject(), resonated });
};

// POST /api/content — create new content post
const createContent = async (req, res) => {
  const { videoUrl, thumbnailUrl, moodTags, caption, attributionUrl, isOriginal } = req.body;

  const content = await Content.create({
    userId: req.user._id,
    creatorHandle: req.user.handle,
    videoUrl,
    thumbnailUrl: thumbnailUrl || null,
    moodTags,
    caption: caption || '',
    attributionUrl: attributionUrl || null,
    isOriginal: isOriginal !== false,
  });

  // Increment user's content count
  await User.findByIdAndUpdate(req.user._id, { $inc: { contentCount: 1 } });

  res.status(201).json(content);
};

// DELETE /api/content/:id
const deleteContent = async (req, res) => {
  const content = await Content.findById(req.params.id);
  if (!content) return res.status(404).json({ message: 'Content not found' });
  if (content.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this content' });
  }

  await Promise.all([
    content.deleteOne(),
    Resonance.deleteMany({ contentId: content._id }),
    User.findByIdAndUpdate(req.user._id, { $inc: { contentCount: -1 } }),
  ]);

  res.json({ message: 'Content deleted' });
};

module.exports = { getFeed, getContent, createContent, deleteContent };
