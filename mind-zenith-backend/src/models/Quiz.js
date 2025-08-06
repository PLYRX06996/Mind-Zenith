const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    quizId: {
        type: String,
        required: true,
        unique: true,
        enum: ['depression', 'anxiety', 'adhd', 'bipolar', 'psychosis', 'ptsd']
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    questions: [{
        questionId: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['radio', 'checkbox', 'scale'],
            default: 'radio'
        },
        options: [{
            value: String,
            text: String,
            score: Number
        }],
        required: {
            type: Boolean,
            default: true
        },
        order: {
            type: Number,
            required: true
        }
    }],
    scoring: {
        ranges: [{
            min: Number,
            max: Number,
            level: String,
            description: String,
            recommendation: String
        }],
        maxScore: {
            type: Number,
            required: true
        }
    },
    crisisResources: {
        enabled: {
            type: Boolean,
            default: true
        },
        message: {
            type: String,
            default: 'If you need immediate help, you can reach the Suicide & Crisis Lifeline by calling or texting 988.'
        },
        resources: [{
            name: String,
            contact: String,
            description: String
        }]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema); 