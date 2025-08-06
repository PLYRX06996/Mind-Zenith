const express = require('express');
const router = express.Router();
const {
    getQuizzes,
    getQuiz,
    submitQuiz
} = require('../controllers/quizController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Quiz routes
router.route('/')
    .get(getQuizzes);

router.route('/:id')
    .get(getQuiz);

router.post('/:id/submit', submitQuiz);



module.exports = router; 