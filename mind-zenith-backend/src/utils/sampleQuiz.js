const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
require('dotenv').config();

const sampleQuiz = {
    quizId: "anxiety",
    title: "Anxiety Assessment Quiz",
    description: "A comprehensive assessment to help you understand your anxiety levels and get personalized recommendations.",
    instructions: "Please answer each question honestly based on how you've been feeling over the past 2 weeks. There are no right or wrong answers - this is just to help understand your current state.",
    questions: [
        {
            questionId: "q1",
            text: "How often do you feel nervous, anxious, or on edge?",
            type: "radio",
            options: [
                { value: "0", text: "Not at all", score: 0 },
                { value: "1", text: "Several days", score: 1 },
                { value: "2", text: "More than half the days", score: 2 },
                { value: "3", text: "Nearly every day", score: 3 }
            ],
            required: true,
            order: 1
        },
        {
            questionId: "q2",
            text: "How often do you have trouble relaxing?",
            type: "radio",
            options: [
                { value: "0", text: "Not at all", score: 0 },
                { value: "1", text: "Several days", score: 1 },
                { value: "2", text: "More than half the days", score: 2 },
                { value: "3", text: "Nearly every day", score: 3 }
            ],
            required: true,
            order: 2
        },
        {
            questionId: "q3",
            text: "How often do you worry too much about different things?",
            type: "radio",
            options: [
                { value: "0", text: "Not at all", score: 0 },
                { value: "1", text: "Several days", score: 1 },
                { value: "2", text: "More than half the days", score: 2 },
                { value: "3", text: "Nearly every day", score: 3 }
            ],
            required: true,
            order: 3
        },
        {
            questionId: "q4",
            text: "How often do you have trouble falling or staying asleep?",
            type: "radio",
            options: [
                { value: "0", text: "Not at all", score: 0 },
                { value: "1", text: "Several days", score: 1 },
                { value: "2", text: "More than half the days", score: 2 },
                { value: "3", text: "Nearly every day", score: 3 }
            ],
            required: true,
            order: 4
        },
        {
            questionId: "q5",
            text: "How often do you feel afraid as if something awful might happen?",
            type: "radio",
            options: [
                { value: "0", text: "Not at all", score: 0 },
                { value: "1", text: "Several days", score: 1 },
                { value: "2", text: "More than half the days", score: 2 },
                { value: "3", text: "Nearly every day", score: 3 }
            ],
            required: true,
            order: 5
        }
    ],
    scoring: {
        ranges: [
            {
                min: 0,
                max: 4,
                level: "minimal",
                description: "Minimal anxiety",
                recommendation: "Your anxiety levels are within normal range. Continue practicing healthy habits."
            },
            {
                min: 5,
                max: 9,
                level: "mild",
                description: "Mild anxiety",
                recommendation: "Consider stress management techniques and lifestyle changes."
            },
            {
                min: 10,
                max: 14,
                level: "moderate",
                description: "Moderate anxiety",
                recommendation: "Consider speaking with a mental health professional."
            },
            {
                min: 15,
                max: 21,
                level: "severe",
                description: "Severe anxiety",
                recommendation: "Please seek professional help. You're not alone."
            }
        ],
        maxScore: 21
    },
    crisisResources: {
        enabled: true,
        message: "If you're experiencing thoughts of self-harm, please call the Suicide & Crisis Lifeline at 988.",
        resources: [
            {
                name: "Suicide & Crisis Lifeline",
                contact: "988",
                description: "24/7 crisis support"
            },
            {
                name: "Crisis Text Line",
                contact: "Text HOME to 741741",
                description: "Text-based crisis support"
            }
        ]
    },
    isActive: true
};

const addSampleQuiz = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if quiz already exists
        const existingQuiz = await Quiz.findOne({ title: sampleQuiz.title });
        if (existingQuiz) {
            console.log('Sample quiz already exists');
            return;
        }

        const quiz = await Quiz.create(sampleQuiz);
        console.log('Sample quiz created:', quiz._id);
        
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error creating sample quiz:', error);
    }
};

// Run if this file is executed directly
if (require.main === module) {
    addSampleQuiz();
}

module.exports = { addSampleQuiz }; 