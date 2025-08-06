const DailyLog = require('../models/DailyLog');

// @desc    Get all daily logs for a user
// @route   GET /api/daily-logs
// @access  Private
const getDailyLogs = async (req, res) => {
    try {
        const { page = 1, limit = 30, sort = 'date', order = 'desc' } = req.query;

        // Build sort object
        const sortObj = {};
        sortObj[sort] = order === 'desc' ? -1 : 1;

        const logs = await DailyLog.find({ userId: req.user._id })
            .sort(sortObj)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await DailyLog.countDocuments({ userId: req.user._id });

        res.json({
            logs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get daily logs error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a specific daily log by date
// @route   GET /api/daily-logs/:date
// @access  Private
const getDailyLogByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const logDate = new Date(date);

        const log = await DailyLog.findOne({
            userId: req.user._id,
            date: {
                $gte: new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate()),
                $lt: new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate() + 1)
            }
        });

        if (!log) {
            return res.status(404).json({ message: 'Daily log not found for this date' });
        }

        res.json(log);
    } catch (error) {
        console.error('Get daily log by date error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create or update a daily log
// @route   POST /api/daily-logs
// @access  Private
const createDailyLog = async (req, res) => {
    try {
        const {
            date,
            mood,
            activities,
            health,
            reflection
        } = req.body;

        const logDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate());

        // Check if log already exists for this date
        let log = await DailyLog.findOne({
            userId: req.user._id,
            date: {
                $gte: startOfDay,
                $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (log) {
            // Update existing log
            if (mood) log.mood = mood;
            if (activities) log.activities = activities;
            if (health) log.health = health;
            if (reflection) log.reflection = reflection;
            
            await log.save();
        } else {
            // Create new log with proper structure
            log = await DailyLog.create({
                userId: req.user._id,
                date: startOfDay,
                mood: mood || { primary: 'okay' },
                activities: activities || {
                    meditation: false,
                    exercise: false,
                    reading: false,
                    social: false,
                    creative: false,
                    outdoor: false
                },
                health: health || {
                    waterIntake: 0,
                    stressLevel: 5,
                    energyLevel: 5,
                    sleepHours: 8,
                    sleepQuality: 'good'
                },
                reflection: reflection || {
                    happiness: '',
                    challenges: '',
                    gratitude: '',
                    goals: ''
                }
            });
        }

        // Add XP for logging (XP is calculated in the model pre-save hook)
        await req.user.addXP(log.xpEarned);

        res.status(201).json(log);
    } catch (error) {
        console.error('Create daily log error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a daily log
// @route   PUT /api/daily-logs/:id
// @access  Private
const updateDailyLog = async (req, res) => {
    try {
        const {
            mood,
            activities,
            health,
            reflection
        } = req.body;

        const log = await DailyLog.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            {
                mood,
                activities,
                health,
                reflection
            },
            { new: true }
        );

        if (!log) {
            return res.status(404).json({ message: 'Daily log not found' });
        }

        res.json(log);
    } catch (error) {
        console.error('Update daily log error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a daily log
// @route   DELETE /api/daily-logs/:id
// @access  Private
const deleteDailyLog = async (req, res) => {
    try {
        const log = await DailyLog.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!log) {
            return res.status(404).json({ message: 'Daily log not found' });
        }

        res.json({ message: 'Daily log deleted successfully' });
    } catch (error) {
        console.error('Delete daily log error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get mood statistics
// @route   GET /api/daily-logs/stats/mood
// @access  Private
const getMoodStats = async (req, res) => {
    try {
        const { period = '30' } = req.query; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        const stats = await DailyLog.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    date: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$mood.primary',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.json(stats);
    } catch (error) {
        console.error('Get mood stats error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get streak information
// @route   GET /api/daily-logs/stats/streak
// @access  Private
const getStreakStats = async (req, res) => {
    try {
        const logs = await DailyLog.find({ userId: req.user._id })
            .sort({ date: -1 })
            .limit(100);

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < logs.length; i++) {
            const logDate = new Date(logs[i].date);
            logDate.setHours(0, 0, 0, 0);

            if (i === 0 && logDate.getTime() === today.getTime()) {
                currentStreak = 1;
                tempStreak = 1;
            } else if (i === 0 && logDate.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
                currentStreak = 1;
                tempStreak = 1;
            } else if (i > 0) {
                const prevDate = new Date(logs[i - 1].date);
                prevDate.setHours(0, 0, 0, 0);
                
                if (logDate.getTime() === prevDate.getTime() - 24 * 60 * 60 * 1000) {
                    tempStreak++;
                    if (i === 0 || i === 1) {
                        currentStreak = tempStreak;
                    }
                } else {
                    tempStreak = 1;
                }
            }

            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
            }
        }

        res.json({
            currentStreak,
            longestStreak,
            totalLogs: logs.length
        });
    } catch (error) {
        console.error('Get streak stats error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getDailyLogs,
    getDailyLogByDate,
    createDailyLog,
    updateDailyLog,
    deleteDailyLog,
    getMoodStats,
    getStreakStats
}; 