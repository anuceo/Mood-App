const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    description: {
      type: String,
      maxlength: 200,
      default: '',
    },
    primaryMood: {
      type: String,
      enum: ['dreamy', 'happy', 'calm', 'melancholy', 'energized', 'cozy', 'nostalgic', 'ethereal'],
      default: 'dreamy',
    },
    contentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Virtual for content count
BoardSchema.virtual('contentCount').get(function () {
  return this.contentIds.length;
});

BoardSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Board', BoardSchema);
