const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/notifications - List notifications
router.get('/', async (req, res) => {
  try {
    const { user_id, unread_only } = req.query;
    let query = db('notifications').select('*');

    if (user_id) query = query.where('user_id', user_id);
    if (unread_only === 'true') query = query.where('read', false);

    const notifications = await query.orderBy('created_at', 'desc').limit(100);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/notifications/user/:userId - Get notifications for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const notifications = await db('notifications')
      .where('user_id', req.params.userId)
      .orderBy('created_at', 'desc')
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/notifications/unread/:userId - Get unread count
router.get('/unread/:userId', async (req, res) => {
  try {
    const [{ count }] = await db('notifications')
      .where('user_id', req.params.userId)
      .where('read', false)
      .count('* as count');
    res.json({ count: parseInt(count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notifications - Create notification
router.post('/', async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;
    const [notification] = await db('notifications')
      .insert({ user_id, title, message, type })
      .returning('*');
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/notifications/:id/read - Mark as read
router.patch('/:id/read', async (req, res) => {
  try {
    const [notification] = await db('notifications')
      .where('id', req.params.id)
      .update({ read: true, updated_at: db.fn.now() })
      .returning('*');
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/notifications/read-all/:userId - Mark all as read
router.patch('/read-all/:userId', async (req, res) => {
  try {
    await db('notifications')
      .where('user_id', req.params.userId)
      .where('read', false)
      .update({ read: true, updated_at: db.fn.now() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('notifications').where('id', req.params.id).del();
    if (!deleted) return res.status(404).json({ error: 'Notification not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
