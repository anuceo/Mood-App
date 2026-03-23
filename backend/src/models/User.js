const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    handle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 2,
      maxlength: 30,
      match: [/^[a-z0-9._]+$/, 'Handle can only contain letters, numbers, dots, and underscores'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // never returned in queries by default
    },
    bio: {
      type: String,
      maxlength: 160,
      default: '',
    },
    primaryMood: {
      type: String,
      enum: ['dreamy', 'happy', 'calm', 'melancholy', 'energized', 'cozy', 'nostalgic', 'ethereal'],
      default: 'dreamy',
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    contentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plain password against stored hash
UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Public profile shape — never expose email or password
UserSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    handle: this.handle,
    bio: this.bio,
    primaryMood: this.primaryMood,
    followersCount: this.followersCount,
    followingCount: this.followingCount,
    contentCount: this.contentCount,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', UserSchema);
