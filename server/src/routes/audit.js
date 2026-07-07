const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/audit - List audit logs
router.get('/', async (req, res) => {
  try {
    const { user_id, action, resource, from, to, limit = 100, offset = 0 } = req.query;
    let query = db('audit_logs')
      .select('audit_logs.*', 'users.username')
      .leftJoin('users', 'audit_logs.user_id', 'users.id');

    if (user_id) query = query.where('audit_logs.user_id', user_id);
    if (action) query = query.where('audit_logs.action', action);
    if (resource) query = query.where('audit_logs.resource', 'ilike', `%${resource}%`);
    if (from) query = query.where('audit_logs.created_at', '>=', from);
    if (to) query = query.where('audit_logs.created_at', '<=', to);

    const logs = await query
      .orderBy('audit_logs.created_at', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    const [{ count }] = await db('audit_logs').count('* as count');

    res.json({ logs, total: parseInt(count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/audit/summary - Get audit summary
router.get('/summary', async (req, res) => {
  try {
    const total = await db('audit_logs').count('* as count').first();
    const today = await db('audit_logs')
      .where('created_at', '>=', db.raw("current_date"))
      .where('created_at', '<', db.raw("current_date + interval '1 day'"))
      .count('* as count')
      .first();
    const byAction = await db('audit_logs')
      .select('action')
      .count('* as count')
      .groupBy('action')
      .orderBy('count', 'desc');
    const byResource = await db('audit_logs')
      .select('resource')
      .count('* as count')
      .groupBy('resource')
      .orderBy('count', 'desc')
      .limit(10);

    res.json({
      total: parseInt(total.count),
      today: parseInt(today.count),
      byAction,
      byResource,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/audit/export - Export audit logs as JSON
router.get('/export', async (req, res) => {
  try {
    const logs = await db('audit_logs')
      .select('audit_logs.*', 'users.username')
      .leftJoin('users', 'audit_logs.user_id', 'users.id')
      .orderBy('created_at', 'desc');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/audit - Create audit log entry
router.post('/', async (req, res) => {
  try {
    const { user_id, action, resource, details, ip_address } = req.body;
    const [log] = await db('audit_logs')
      .insert({ user_id, action, resource, details, ip_address })
      .returning('*');
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
