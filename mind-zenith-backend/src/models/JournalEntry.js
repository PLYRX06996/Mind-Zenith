const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    journalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Journal',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    wordCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    images: [{
        filename: String,
        originalName: String,
        path: String,
        size: Number,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isStarred: {
        type: Boolean,
        default: false
    },
    mood: {
        type: String,
        enum: ['excellent', 'good', 'okay', 'bad', 'terrible'],
        default: 'okay'
    },
    weather: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    entryDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for faster queries
journalEntrySchema.index({ userId: 1, journalId: 1, createdAt: -1 });
journalEntrySchema.index({ userId: 1, isStarred: 1 });
journalEntrySchema.index({ userId: 1, tags: 1 });
journalEntrySchema.index({ userId: 1, entryDate: -1 });

// Calculate word count before saving
journalEntrySchema.pre('save', function(next) {
    if (this.isModified('content')) {
        this.wordCount = this.content.trim().split(/\s+/).length;
        this.updatedAt = new Date();
    }
    next();
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema); 