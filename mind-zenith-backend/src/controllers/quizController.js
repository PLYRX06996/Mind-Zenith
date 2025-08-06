const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

// @desc    Get all available quizzes
// @route   GET /api/quizzes
// @access  Private
const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ isActive: true })
            .select('-questions.answers.correct')
            .sort({ createdAt: -1 });

        res.json(quizzes);
    } catch (error) {
        console.error('Get quizzes error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a specific quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
const getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .select('-questions.answers.correct');

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json(quiz);
    } catch (error) {
        console.error('Get quiz error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Submit quiz answers and get results
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = async (req, res) => {
    try {
        const { answers, timeSpent } = req.body;
        const quizId = req.params.id;

        // Get the quiz
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Calculate total score
        let totalScore = 0;
        const detailedResults = [];

        quiz.questions.forEach((question) => {
            // Find the user's answer for this question
            const userAnswerObj = answers.find(ans => ans.questionId === question.questionId);
            const userAnswer = userAnswerObj ? userAnswerObj.userAnswer : null;
            
            const selectedOption = question.options.find(opt => opt.value === userAnswer);
            
            if (selectedOption) {
                totalScore += selectedOption.score;
            }

            detailedResults.push({
                questionId: question.questionId,
                userAnswer: userAnswer || '',
                score: selectedOption ? selectedOption.score : 0
            });
        });

        // Determine level based on score ranges
        let level = 'minimal';
        let recommendation = '';
        
        for (const range of quiz.scoring.ranges) {
            if (totalScore >= range.min && totalScore <= range.max) {
                level = range.level;
                recommendation = range.recommendation;
                break;
            }
        }

        // Create quiz result
        const quizResult = await QuizResult.create({
            userId: req.user._id,
            quizId: quiz._id,
            score: totalScore,
            maxScore: quiz.scoring.maxScore,
            level,
            recommendation,
            answers: detailedResults,
            timeSpent: timeSpent || 0,
            completedAt: new Date()
        });

        // Add XP based on completion (not performance for assessment quizzes)
        const xpEarned = 15;
        await req.user.addXP(xpEarned);

        // Prepare response
        const response = {
            _id: quizResult._id,
            score: totalScore,
            maxScore: quiz.scoring.maxScore,
            level,
            recommendation,
            timeSpent: quizResult.timeSpent,
            completedAt: quizResult.completedAt,
            xpEarned,
            crisisResources: quiz.crisisResources
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Submit quiz error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user's quiz results
// @route   GET /api/quizzes/results
// @access  Private
const getQuizResults = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const results = await QuizResult.find({ userId: req.user._id })
            .populate('quizId', 'title description')
            .sort({ completedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await QuizResult.countDocuments({ userId: req.user._id });

        res.json({
            results,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get quiz results error:', error.message);
        console.error('Full error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a specific quiz result
// @route   GET /api/quizzes/results/:id
// @access  Private
const getQuizResult = async (req, res) => {
    try {
        const result = await QuizResult.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).populate('quizId', 'title description');

        if (!result) {
            return res.status(404).json({ message: 'Quiz result not found' });
        }

        res.json(result);
    } catch (error) {
        console.error('Get quiz result error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get quiz statistics for user
// @route   GET /api/quizzes/stats
// @access  Private
const getQuizStats = async (req, res) => {
    try {
        const stats = await QuizResult.aggregate([
            {
                $match: { userId: req.user._id }
            },
            {
                $group: {
                    _id: null,
                    totalQuizzes: { $sum: 1 },
                    averageScore: { $avg: '$score' },
                    highestScore: { $max: '$score' },
                    totalTimeSpent: { $sum: '$timeSpent' }
                }
            }
        ]);

        // Get level distribution
        const levelStats = await QuizResult.aggregate([
            {
                $match: { userId: req.user._id }
            },
            {
                $group: {
                    _id: '$level',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Get recent activity
        const recentActivity = await QuizResult.find({ userId: req.user._id })
            .populate('quizId', 'title')
            .sort({ completedAt: -1 })
            .limit(5);

        const response = {
            overall: stats[0] || {
                totalQuizzes: 0,
                averageScore: 0,
                highestScore: 0,
                totalTimeSpent: 0
            },
            levelDistribution: levelStats,
            recentActivity
        };

        res.json(response);
    } catch (error) {
        console.error('Get quiz stats error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a quiz result
// @route   DELETE /api/quizzes/results/:id
// @access  Private
const deleteQuizResult = async (req, res) => {
    try {
        const result = await QuizResult.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!result) {
            return res.status(404).json({ message: 'Quiz result not found' });
        }

        res.json({ message: 'Quiz result deleted successfully' });
    } catch (error) {
        console.error('Delete quiz result error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getQuizzes,
    getQuiz,
    submitQuiz
}; 