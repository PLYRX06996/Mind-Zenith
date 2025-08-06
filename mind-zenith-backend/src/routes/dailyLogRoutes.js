const express = require('express');
const router = express.Router();
const {
    getDailyLogs,
    getDailyLogByDate,
    createDailyLog,
    updateDailyLog,
    deleteDailyLog,
    getMoodStats,
    getStreakStats
} = require('../controllers/dailyLogController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Daily log routes
router.route('/')
    .get(getDailyLogs)
    .post(createDailyLog);

router.route('/:id')
    .put(updateDailyLog)
    .delete(deleteDailyLog);

// Get log by specific date
router.get('/date/:date', getDailyLogByDate);

// Statistics routes
router.get('/stats/mood', getMoodStats);
router.get('/stats/streak', getStreakStats);

module.exports = router; 