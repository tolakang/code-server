const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/teams - List all teams
router.get('/', async (req, res) => {
  try {
    const teams = await db('teams')
      .select(
        'teams.*',
        db.raw('COALESCE(json_agg(json_build_object("userId", tm.user_id, "username", u.username)) FILTER (WHERE tm.user_id IS NOT NULL), \'[]\') as members')
      )
      .leftJoin('team_members as tm', 'teams.id', 'tm.team_id')
      .leftJoin('users as u', 'tm.user_id', 'u.id')
      .groupBy('teams.id')
      .orderBy('teams.created_at', 'desc');
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/teams/:id - Get single team
router.get('/:id', async (req, res) => {
  try {
    const team = await db('teams').where('id', req.params.id).first();
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const members = await db('team_members')
      .join('users', 'users.id', 'team_members.user_id')
      .where('team_members.team_id', req.params.id)
      .select('users.id', 'users.username', 'users.email');

    res.json({ ...team, members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/teams - Create team
router.post('/', async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const [team] = await db('teams')
      .insert({ name, description })
      .returning('*');

    if (members && members.length > 0) {
      const memberInserts = members.map((userId) => ({
        team_id: team.id,
        user_id: userId,
      }));
      await db('team_members').insert(memberInserts);
    }

    res.status(201).json({ ...team, members: members || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/teams/:id - Update team
router.put('/:id', async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const [team] = await db('teams')
      .where('id', req.params.id)
      .update({ name, description, updated_at: db.fn.now() })
      .returning('*');
    if (!team) return res.status(404).json({ error: 'Team not found' });

    if (members !== undefined) {
      await db('team_members').where('team_id', req.params.id).del();
      if (members.length > 0) {
        const memberInserts = members.map((userId) => ({
          team_id: team.id,
          user_id: userId,
        }));
        await db('team_members').insert(memberInserts);
      }
    }

    res.json({ ...team, members: members || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/teams/:id - Delete team
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('teams').where('id', req.params.id).del();
    if (!deleted) return res.status(404).json({ error: 'Team not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
