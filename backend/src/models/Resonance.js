const mongoose = require('mongoose');

const ResonanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      default: null, // optional — resonance without saving to a board is valid
    },
  },
  { timestamps: true }
);

// A user can only resonate with a piece of content once
ResonanceSchema.index({ userId: 1, contentId: 1 }, { unique: true });

// Fast lookup of all resonances for a given content item
ResonanceSchema.index({ contentId: 1 });

module.exports = mongoose.model('Resonance', ResonanceSchema);
