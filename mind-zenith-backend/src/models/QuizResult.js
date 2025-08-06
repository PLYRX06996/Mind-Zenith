const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    maxScore: {
        type: Number,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ['minimal', 'mild', 'moderate', 'severe']
    },
    recommendation: {
        type: String,
        default: ''
    },
    answers: [{
        questionId: {
            type: String,
            required: true
        },
        userAnswer: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        }
    }],
    completedAt: {
        type: Date,
        default: Date.now
    },
    timeSpent: {
        type: Number, // in seconds
        default: 0
    },
    crisisFlagged: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for faster queries
quizResultSchema.index({ userId: 1, quizId: 1, completedAt: -1 });
quizResultSchema.index({ userId: 1, level: 1 });
quizResultSchema.index({ userId: 1, crisisFlagged: 1 });

module.exports = mongoose.model('QuizResult', quizResultSchema); 