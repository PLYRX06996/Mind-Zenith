const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    mood: {
        primary: {
            type: String,
            enum: ['excellent', 'good', 'okay', 'bad', 'terrible'],
            required: true
        },
        secondary: {
            type: String,
            enum: ['happy', 'excited', 'calm', 'sad', 'angry', 'anxious'],
            default: null
        }
    },
    activities: {
        meditation: { type: Boolean, default: false },
        exercise: { type: Boolean, default: false },
        reading: { type: Boolean, default: false },
        social: { type: Boolean, default: false },
        creative: { type: Boolean, default: false },
        outdoor: { type: Boolean, default: false }
    },
    health: {
        waterIntake: {
            type: Number,
            min: 0,
            max: 20,
            default: 0
        },
        stressLevel: {
            type: Number,
            min: 1,
            max: 10,
            default: 5
        },
        energyLevel: {
            type: Number,
            min: 1,
            max: 10,
            default: 5
        },
        sleepHours: {
            type: Number,
            min: 0,
            max: 24,
            default: 8
        },
        sleepQuality: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor'],
            default: 'good'
        }
    },
    reflection: {
        happiness: {
            type: String,
            default: ''
        },
        challenges: {
            type: String,
            default: ''
        },
        gratitude: {
            type: String,
            default: ''
        },
        goals: {
            type: String,
            default: ''
        }
    },
    xpEarned: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for faster queries
dailyLogSchema.index({ userId: 1, date: -1 });
dailyLogSchema.index({ userId: 1, 'mood.primary': 1 });
dailyLogSchema.index({ userId: 1, createdAt: -1 });

// Ensure only one log per user per day
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

// Calculate XP earned based on activities and mood
dailyLogSchema.pre('save', function(next) {
    let xp = 10; // Base XP for logging
    
    // Bonus XP for good mood
    if (this.mood.primary === 'excellent') xp += 5;
    else if (this.mood.primary === 'good') xp += 3;
    
    // Bonus XP for activities
    if (this.activities.meditation) xp += 3;
    if (this.activities.exercise) xp += 3;
    if (this.activities.reading) xp += 2;
    if (this.activities.social) xp += 2;
    if (this.activities.creative) xp += 2;
    if (this.activities.outdoor) xp += 2;
    
    // Bonus XP for good health habits
    if (this.health.waterIntake >= 8) xp += 2;
    if (this.health.sleepHours >= 7 && this.health.sleepHours <= 9) xp += 2;
    if (this.health.stressLevel <= 5) xp += 2;
    if (this.health.energyLevel >= 6) xp += 2;
    
    // Bonus XP for reflection
    if (this.reflection.happiness.trim()) xp += 1;
    if (this.reflection.gratitude.trim()) xp += 1;
    if (this.reflection.goals.trim()) xp += 1;
    
    this.xpEarned = xp;
    next();
});

module.exports = mongoose.model('DailyLog', dailyLogSchema); 