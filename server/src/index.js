require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const httpProxy = require('http-proxy');
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
const filesRouter = require('./routes/files');
const terminalHandler = require('./routes/terminal');

const app = express();
const PORT = process.env.PORT || 8080;
const CODE_SERVER_PORT = process.env.CODE_SERVER_INTERNAL_PORT || 8081;
const CODE_SERVER_HOST = '127.0.0.1';

// WebSocket proxy for code-server
const wsProxy = httpProxy.createProxyServer({ target: `http://${CODE_SERVER_HOST}:${CODE_SERVER_PORT}`, ws: true });
wsProxy.on('error', (err, req, res) => {
  console.error('WebSocket proxy error:', err.message);
  if (res && res.writeHead) res.writeHead(502);
  if (res && res.end) res.end('Bad Gateway');
});

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
app.use('/api', filesRouter);

// Proxy HTTP requests to code-server (for non-API, non-static routes)
app.use('/absproxy', (req, res) => {
  wsProxy.web(req, res);
});
app.use('/proxy', (req, res) => {
  wsProxy.web(req, res);
});

// 404 for unknown API routes (must be before static/catch-all)
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Serve the React mobile wrapper app
const reactAppPath = path.join(__dirname, '../../wrapper/app/dist');
app.use(express.static(reactAppPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(reactAppPath, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Create HTTP server and attach WebSocket upgrade handler
const server = http.createServer(app);
server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/api/terminal') {
    terminalHandler.handleUpgrade(req, socket, head);
  } else {
    // Rewrite /absproxy/* and /proxy/* paths so code-server receives bare paths
    const proxyPath = url.pathname.replace(/^\/(absproxy|proxy)/, '');
    req.url = proxyPath + url.search;
    wsProxy.upgrade(req, socket, head);
  }
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

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
      console.log(`React app served from ${reactAppPath}`);
      console.log(`WebSocket proxy to code-server at ${CODE_SERVER_HOST}:${CODE_SERVER_PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

module.exports = app;
