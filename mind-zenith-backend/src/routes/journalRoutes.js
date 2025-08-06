const express = require('express');
const router = express.Router();
const {
    getJournals,
    createJournal,
    updateJournal,
    deleteJournal,
    getJournalEntries,
    createJournalEntry,
    getJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    toggleStarEntry,
    searchEntries
} = require('../controllers/journalController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Journal routes
router.route('/')
    .get(getJournals)
    .post(createJournal);

router.route('/:id')
    .put(updateJournal)
    .delete(deleteJournal);

// Journal entries routes
router.route('/:id/entries')
    .get(getJournalEntries)
    .post(createJournalEntry);

// Individual entry routes
router.route('/entries/:id')
    .get(getJournalEntry)
    .put(updateJournalEntry)
    .delete(deleteJournalEntry);

router.put('/entries/:id/star', toggleStarEntry);

// Search routes
router.get('/entries/search', searchEntries);

module.exports = router; 