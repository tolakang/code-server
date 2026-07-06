require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./db');
const { authMiddleware } = require('./middleware/auth');

// Routes
const usersRouter = require('./routes/users');
const teamsRouter = require('./routes/teams');
const auditRouter = require('./routes/audit');
const notificationsRouter = require('./routes/notifications');
const workspacesRouter = require('./routes/workspaces');
const aiRouter = require('./routes/ai');
const mcpRouter = require('./routes/mcp');

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(authMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/audit', auditRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/workspaces', workspacesRouter);
app.use('/api/ai', aiRouter);
app.use('/api/mcp', mcpRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function start() {
  try {
    // Test database connection
    await db.raw('SELECT 1');
    console.log('Database connected');

    // Run migrations
    const [batchNo, log] = await db.migrate.latest();
    if (log.length === 0) {
      console.log('Already up to date');
    } else {
      console.log(`Ran ${log.length} migration(s): batch ${batchNo}`);
      log.forEach((file) => console.log(`  - ${file}`));
    }

    app.listen(PORT, '127.0.0.1', () => {
      console.log(`Backend server running on http://127.0.0.1:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

module.exports = app;
