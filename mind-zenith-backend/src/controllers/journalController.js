const Journal = require('../models/Journal');
const JournalEntry = require('../models/JournalEntry');

// @desc    Get all journals for a user
// @route   GET /api/journals
// @access  Private
const getJournals = async (req, res) => {
    try {
        const journals = await Journal.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        res.json(journals);
    } catch (error) {
        console.error('Get journals error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new journal
// @route   POST /api/journals
// @access  Private
const createJournal = async (req, res) => {
    try {
        const { title, description, color } = req.body;

        const journal = await Journal.create({
            userId: req.user._id,
            title,
            description: description || '',
            color: color || '#7a6cff'
        });

        res.status(201).json(journal);
    } catch (error) {
        console.error('Create journal error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a journal
// @route   PUT /api/journals/:id
// @access  Private
const updateJournal = async (req, res) => {
    try {
        const { title, description, color } = req.body;

        const journal = await Journal.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title, description, color },
            { new: true }
        );

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        res.json(journal);
    } catch (error) {
        console.error('Update journal error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a journal
// @route   DELETE /api/journals/:id
// @access  Private
const deleteJournal = async (req, res) => {
    try {
        const journal = await Journal.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        // Delete all entries in this journal
        await JournalEntry.deleteMany({ journalId: req.params.id });

        res.json({ message: 'Journal deleted successfully' });
    } catch (error) {
        console.error('Delete journal error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all entries for a journal
// @route   GET /api/journals/:id/entries
// @access  Private
const getJournalEntries = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', filter } = req.query;

        // Verify journal belongs to user
        const journal = await Journal.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        // Build query
        let query = { journalId: req.params.id };
        
        // Add filters
        if (filter === 'starred') {
            query.isStarred = true;
        } else if (filter && filter.startsWith('tag:')) {
            const tag = filter.substring(4);
            query.tags = tag;
        }

        // Build sort object
        const sortObj = {};
        sortObj[sort] = order === 'desc' ? -1 : 1;

        const entries = await JournalEntry.find(query)
            .sort(sortObj)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await JournalEntry.countDocuments(query);

        res.json({
            entries,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get journal entries error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new journal entry
// @route   POST /api/journals/:id/entries
// @access  Private
const createJournalEntry = async (req, res) => {
    try {
        const {
            title,
            content,
            tags,
            mood,
            weather,
            location,
            entryDate,
            images
        } = req.body;

        // Verify journal belongs to user
        const journal = await Journal.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        const entry = await JournalEntry.create({
            userId: req.user._id,
            journalId: req.params.id,
            title,
            content,
            tags: tags || [],
            mood: mood || 'okay',
            weather: weather || '',
            location: location || '',
            entryDate: entryDate || new Date(),
            images: images || []
        });

        // Update journal entry count and last entry date
        await Journal.findByIdAndUpdate(req.params.id, {
            $inc: { entryCount: 1 },
            lastEntryDate: entry.entryDate
        });

        // Add XP for creating entry
        await req.user.addXP(5);

        res.status(201).json(entry);
    } catch (error) {
        console.error('Create journal entry error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a specific journal entry
// @route   GET /api/entries/:id
// @access  Private
const getJournalEntry = async (req, res) => {
    try {
        const entry = await JournalEntry.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        res.json(entry);
    } catch (error) {
        console.error('Get journal entry error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a journal entry
// @route   PUT /api/entries/:id
// @access  Private
const updateJournalEntry = async (req, res) => {
    try {
        const {
            title,
            content,
            tags,
            mood,
            weather,
            location,
            entryDate,
            images
        } = req.body;

        const entry = await JournalEntry.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            {
                title,
                content,
                tags: tags || [],
                mood: mood || 'okay',
                weather: weather || '',
                location: location || '',
                entryDate: entryDate || new Date(),
                images: images || []
            },
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        res.json(entry);
    } catch (error) {
        console.error('Update journal entry error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a journal entry
// @route   DELETE /api/entries/:id
// @access  Private
const deleteJournalEntry = async (req, res) => {
    try {
        const entry = await JournalEntry.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Update journal entry count
        await Journal.findByIdAndUpdate(entry.journalId, {
            $inc: { entryCount: -1 }
        });

        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error('Delete journal entry error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Toggle star on journal entry
// @route   PUT /api/entries/:id/star
// @access  Private
const toggleStarEntry = async (req, res) => {
    try {
        const entry = await JournalEntry.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        entry.isStarred = !entry.isStarred;
        await entry.save();

        res.json(entry);
    } catch (error) {
        console.error('Toggle star error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Search journal entries
// @route   GET /api/entries/search
// @access  Private
const searchEntries = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const query = {
            userId: req.user._id,
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { content: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } }
            ]
        };

        const entries = await JournalEntry.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('journalId', 'title');

        const total = await JournalEntry.countDocuments(query);

        res.json({
            entries,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Search entries error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
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
}; 