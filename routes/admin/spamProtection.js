import express from 'express';
import { pool1 } from '../pool.js';

const router = express.Router();

// Get all blocked entries
router.get('/blocked', async (req, res) => {
    try {
        const { rows } = await pool1.query(
            'SELECT * FROM blocked_entries WHERE is_active = true ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blocked entries' });
        console.error(error);
    }
});

// Add new blocked entry
router.post('/blocked', async (req, res) => {
    const { type, value, reason } = req.body;
    const created_by = req.session.adminUser; // Assuming you have admin user in session

    try {
        await pool1.query(
            'INSERT INTO blocked_entries (type, value, reason, created_by) VALUES ($1, $2, $3, $4)',
            [type, value, reason, created_by]
        );
        res.json({ message: 'Entry blocked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to block entry' });
        console.error(error);
    }
});

// Remove blocked entry
router.delete('/blocked/:id', async (req, res) => {
    try {
        await pool1.query(
            'UPDATE blocked_entries SET is_active = false WHERE id = $1',
            [req.params.id]
        );
        res.json({ message: 'Entry unblocked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unblock entry' });
        console.error(error);
    }
});

// Validation middleware for submissions
const validateSubmission = async (req, res, next) => {
    const { Email: email, Number: phone_number, Message: message } = req.body; // Updated to match form field names

    try {
        // Check blocked emails
        const { rows: blockedEmail } = await pool1.query(
            'SELECT * FROM blocked_entries WHERE type = $1 AND value = $2 AND is_active = true',
            ['email', email]
        );
        if (blockedEmail.length > 0) {
            return res.status(403).json({ 
                error: `Your email has been banned: ${blockedEmail[0].reason || 'Contact support for more information'}`
            });
        }

        // Check blocked phone numbers
        if (phone_number) {
            const { rows: blockedPhone } = await pool1.query(
                'SELECT * FROM blocked_entries WHERE type = $1 AND value = $2 AND is_active = true',
                ['phone', phone_number]
            );
            if (blockedPhone.length > 0) {
                return res.status(403).json({ 
                    error: `This phone number has been banned: ${blockedPhone[0].reason || 'Contact support for more information'}`
                });
            }
        }

        // Check blocked keywords
        const { rows: keywords } = await pool1.query(
            'SELECT value, reason FROM blocked_entries WHERE type = $1 AND is_active = true',
            ['keyword']
        );

        for (const keyword of keywords) {
            if (message.toLowerCase().includes(keyword.value.toLowerCase())) {
                return res.status(403).json({ 
                    error: `Your message contains blocked content: ${keyword.reason || 'Contact support for more information'}`
                });
            }
        }

        next();
    } catch (error) {
        console.error('Validation error:', error);
        return res.status(500).json({ error: 'Validation failed', details: error.message });
    }
};

export { router, validateSubmission };
