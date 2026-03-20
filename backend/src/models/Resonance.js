const mongoose = require('mongoose');

const ResonanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    resonatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

ResonanceSchema.index({ userId: 1, contentId: 1 }, { unique: true });

module.exports = mongoose.model('Resonance', ResonanceSchema);