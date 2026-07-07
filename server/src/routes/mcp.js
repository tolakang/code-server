const express = require('express');
const http = require('http');
const router = express.Router();

// MCP server state
let mcpConnected = false;
let mcpConfig = {
  host: process.env.MCP_SERVER_HOST || 'localhost',
  port: parseInt(process.env.MCP_SERVER_PORT || '8083'),
};

// GET /api/mcp/status - Get MCP server status
router.get('/status', (req, res) => {
  res.json({
    status: mcpConnected ? 'connected' : 'disconnected',
    version: '1.0.0',
    uptime: process.uptime().toString(),
    connectedAgents: mcpConnected ? 1 : 0,
    config: mcpConfig,
  });
});

// POST /api/mcp/connect - Connect to MCP server
router.post('/connect', async (req, res) => {
  try {
    const { host, port } = req.body;
    if (host) mcpConfig.host = host;
    if (port) mcpConfig.port = parseInt(port);

    // Try to connect to MCP server
    const ping = new Promise((resolve, reject) => {
      const request = http.get(
        `http://${mcpConfig.host}:${mcpConfig.port}/health`,
        (response) => {
          let data = '';
          response.on('data', (chunk) => (data += chunk));
          response.on('end', () => resolve(data));
        }
      );
      request.on('error', reject);
      request.setTimeout(3000, () => {
        request.destroy();
        reject(new Error('Connection timeout'));
      });
    });

    await ping;
    mcpConnected = true;
    res.json({
      status: 'connected',
      version: '1.0.0',
      uptime: process.uptime().toString(),
      connectedAgents: 1,
      config: mcpConfig,
    });
  } catch (err) {
    mcpConnected = false;
    res.json({
      status: 'error',
      version: '1.0.0',
      uptime: process.uptime().toString(),
      connectedAgents: 0,
      error: err.message,
      config: mcpConfig,
    });
  }
});

// POST /api/mcp/disconnect - Disconnect from MCP server
router.post('/disconnect', (req, res) => {
  mcpConnected = false;
  res.json({ connected: false });
});

// GET /api/mcp/models - List available MCP models
router.get('/models', (req, res) => {
  res.json({ models: [] });
});

// POST /api/mcp/send - Send message to MCP server
router.post('/send', async (req, res) => {
  if (!mcpConnected) {
    return res.status(503).json({ error: 'MCP server not connected' });
  }

  try {
    let { method, params, message } = req.body;
    // Accept both { message } (client) and { method, params } (standard) formats
    if (message && !method) {
      method = 'send';
      params = { message };
    }
    // Proxy to MCP server
    const postData = JSON.stringify({ method, params });

    const result = await new Promise((resolve, reject) => {
      const request = http.request(
        {
          hostname: mcpConfig.host,
          port: mcpConfig.port,
          path: '/rpc',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
          },
        },
        (response) => {
          let data = '';
          response.on('data', (chunk) => (data += chunk));
          response.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch {
              resolve({ raw: data });
            }
          });
        }
      );
      request.on('error', reject);
      request.write(postData);
      request.end();
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
