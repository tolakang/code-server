const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/users - List all users
router.get('/', async (req, res) => {
  try {
    const { search, role, status } = req.query;
    let query = db('users').select('*');

    if (search) {
      query = query.where(function () {
        this.where('username', 'ilike', `%${search}%`)
          .orWhere('email', 'ilike', `%${search}%`)
          .orWhere('full_name', 'ilike', `%${search}%`);
      });
    }
    if (role) query = query.where('role', role);
    if (status) query = query.where('status', status);

    const users = await query.orderBy('created_at', 'desc');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/search?q=query - Search users
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const users = await db('users')
      .where(function () {
        this.where('username', 'ilike', `%${q}%`)
          .orWhere('email', 'ilike', `%${q}%`)
          .orWhere('full_name', 'ilike', `%${q}%`);
      })
      .select('*')
      .limit(20);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/roles - Get available roles
router.get('/roles', (req, res) => {
  res.json(['admin', 'editor', 'viewer']);
});

// GET /api/users/statuses - Get available statuses
router.get('/statuses', (req, res) => {
  res.json(['active', 'inactive', 'pending']);
});

// GET /api/users/:id - Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await db('users').where('id', req.params.id).first();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users - Create user
router.post('/', async (req, res) => {
  try {
    const { username, email, full_name, role, status } = req.body;
    const [user] = await db('users')
      .insert({ username, email, full_name, role, status })
      .returning('*');
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const { username, email, full_name, role, status } = req.body;
    const [user] = await db('users')
      .where('id', req.params.id)
      .update({ username, email, full_name, role, status, updated_at: db.fn.now() })
      .returning('*');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('users').where('id', req.params.id).del();
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
