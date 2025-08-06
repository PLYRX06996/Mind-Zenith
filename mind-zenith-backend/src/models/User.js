const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
        default: 'MindZenithUser'
    },
    avatar: {
        type: String,
        default: 'thor.png'
    },
    aboutMe: {
        type: String,
        default: ''
    },
    privacy: {
        showBadgesOnCommunityWall: {
            type: Boolean,
            default: true
        }
    },
    xp: {
        current: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        },
        level: {
            type: Number,
            default: 1
        }
    },
    streak: {
        current: {
            type: Number,
            default: 0
        },
        longest: {
            type: Number,
            default: 0
        },
        lastLoginDate: {
            type: Date,
            default: Date.now
        }
    },
    inventory: {
        avatars: [{
            type: String,
            default: ['thor.png']
        }],
        pets: [{
            type: String,
            default: []
        }],
        badges: [{
            type: String,
            default: []
        }]
    },
    achievements: [{
        badgeId: String,
        earnedAt: {
            type: Date,
            default: Date.now
        },
        description: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to add XP and level up
userSchema.methods.addXP = function(amount) {
    this.xp.current += amount;
    this.xp.total += amount;
    
    // Level up logic (every 100 XP = 1 level)
    const newLevel = Math.floor(this.xp.current / 100) + 1;
    if (newLevel > this.xp.level) {
        this.xp.level = newLevel;
    }
    
    return this.save();
};

// Method to update streak
userSchema.methods.updateStreak = function() {
    const today = new Date();
    const lastLogin = new Date(this.streak.lastLoginDate);
    const diffTime = today - lastLogin;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        // Consecutive day
        this.streak.current += 1;
        if (this.streak.current > this.streak.longest) {
            this.streak.longest = this.streak.current;
        }
    } else if (diffDays > 1) {
        // Streak broken
        this.streak.current = 1;
    }
    
    this.streak.lastLoginDate = today;
    this.lastActive = today;
    
    return this.save();
};

module.exports = mongoose.model('User', userSchema); 