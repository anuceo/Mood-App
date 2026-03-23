const mongoose = require('mongoose');

const VALID_MOODS = ['dreamy', 'happy', 'calm', 'melancholy', 'energized', 'cozy', 'nostalgic', 'ethereal'];

const ContentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Denormalised for fast feed rendering — kept in sync on user handle changes
    creatorHandle: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    moodTags: {
      type: [{ type: String, enum: VALID_MOODS }],
      validate: {
        validator: (tags) => tags.length >= 1 && tags.length <= 4,
        message: 'Content must have between 1 and 4 mood tags',
      },
    },
    caption: {
      type: String,
      maxlength: 300,
      default: '',
    },
    attributionUrl: {
      type: String,
      default: null,
    },
    isOriginal: {
      type: Boolean,
      default: true,
    },
    resonanceCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index for efficient mood-filtered feed queries
ContentSchema.index({ moodTags: 1, createdAt: -1 });

module.exports = mongoose.model('Content', ContentSchema);
