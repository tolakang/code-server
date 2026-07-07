const { URL } = require('url');
const httpProxy = require('http-proxy');

const CODE_SERVER_HOST = process.env.CODE_SERVER_INTERNAL_HOST || '127.0.0.1';
const CODE_SERVER_PORT = process.env.CODE_SERVER_INTERNAL_PORT || 8081;

const wsProxy = httpProxy.createProxyServer({
  target: `http://${CODE_SERVER_HOST}:${CODE_SERVER_PORT}`,
  ws: true,
});
wsProxy.on('error', (err) => {
  console.error('Terminal WebSocket proxy error:', err.message);
});

function handleUpgrade(req, socket, head) {
  req.url = '/vscode/terminal';
  wsProxy.ws(req, socket, head);
}

module.exports = { handleUpgrade };
