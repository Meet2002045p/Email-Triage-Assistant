const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock Data (Moved from Frontend)
let emails = Array.from({ length: 50 }).map((_, i) => ({
    id: `email-${i}`,
    from: `sender${i}@example.com`,
    to: 'me@example.com',
    subject: `Project Update ${i}`,
    body: `This is the body of email ${i}...`,
    receivedAt: new Date(Date.now() - i * 3600000).toISOString(),
    isRead: i > 20,
    needsReply: i % 3 === 0,
    category: i % 4 === 0 ? 'Urgent' : 'General',
    threadId: `thread-${Math.floor(i / 2)}`,
    isDraft: false
}));

// Routes

// GET /api/emails - Fetch all emails
app.get('/api/emails', (req, res) => {
    res.json(emails);
});

// GET /api/emails/:id - Fetch single email
app.get('/api/emails/:id', (req, res) => {
    const email = emails.find(e => e.id === req.params.id);
    if (email) {
        res.json(email);
    } else {
        res.status(404).json({ message: 'Email not found' });
    }
});

// POST /api/emails/:id/reply - Send reply (Simulation)
app.post('/api/emails/:id/reply', (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    // Simulate sending
    console.log(`Replying to ${id} with: ${content}`);

    // Mark as replied/read if needed
    const emailIndex = emails.findIndex(e => e.id === id);
    if (emailIndex !== -1) {
        emails[emailIndex].needsReply = false;
        emails[emailIndex].isRead = true;
    }

    res.json({ message: 'Reply sent successfully' });
});

// POST /api/drafts - Save draft
app.post('/api/drafts', (req, res) => {
    const { id, content, subject, to } = req.body;

    const newDraft = {
        id: id || `draft-${Date.now()}`,
        from: 'Me',
        to: to || 'Recipient',
        subject: subject || 'No Subject',
        body: content,
        receivedAt: new Date().toISOString(),
        isRead: true,
        isDraft: true,
        threadId: null // or link to existing thread
    };

    emails.unshift(newDraft);
    res.json(newDraft);
});

// GET /api/analytics - Fetch analytics data
app.get('/api/analytics', (req, res) => {
    const stats = {
        processed: emails.length,
        savedTime: '12.5 hrs', // Mock logic could be added here
        responseRate: '92%',
        avgReplyTime: '15 min'
    };
    res.json(stats);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
