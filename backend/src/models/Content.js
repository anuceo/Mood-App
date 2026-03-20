const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    videoUrl: {
        type: String,
        required: true
    },
    moodTags: [String],
    creatorHandle: {
        type: String,
        required: true
    },
    attributionUrl: String,
    isOriginal: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resonanceCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Content', ContentSchema);