const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/workspaces - List workspaces
router.get('/', async (req, res) => {
  try {
    const workspaces = await db('workspaces')
      .select('workspaces.*', 'users.username')
      .leftJoin('users', 'workspaces.user_id', 'users.id')
      .orderBy('workspaces.created_at', 'desc');
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/workspaces/:id - Get single workspace
router.get('/:id', async (req, res) => {
  try {
    const workspace = await db('workspaces').where('id', req.params.id).first();
    if (!workspace) return res.status(404).json({ error: 'Workspace not found' });
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/workspaces - Create workspace
router.post('/', async (req, res) => {
  try {
    const { name, path, user_id } = req.body;
    if (!name || !path) return res.status(400).json({ error: 'name and path are required' });
    const [workspace] = await db('workspaces')
      .insert({ name, path, user_id })
      .returning('*');
    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/workspaces/:id/switch - Switch to workspace
router.post('/:id/switch', async (req, res) => {
  try {
    const workspace = await db('workspaces').where('id', req.params.id).first();
    if (!workspace) return res.status(404).json({ error: 'Workspace not found' });
    res.json({ switched: true, workspace });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/workspaces/:id - Delete workspace
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('workspaces').where('id', req.params.id).del();
    if (!deleted) return res.status(404).json({ error: 'Workspace not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
