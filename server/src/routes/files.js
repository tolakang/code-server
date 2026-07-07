const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.env.FILES_ROOT_DIR || '/workspace';

// GET /api/files?path= - List files
router.get('/files', (req, res) => {
  try {
    const dirPath = req.query.path || '/';
    const safePath = path.normalize(path.join(ROOT_DIR, dirPath));
    if (!safePath.startsWith(ROOT_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const entries = fs.readdirSync(safePath, { withFileTypes: true });
    const files = entries.map((entry) => ({
      name: entry.name,
      type: entry.isDirectory() ? 'directory' : 'file',
      size: entry.isFile() ? fs.statSync(path.join(safePath, entry.name)).size : 0,
      path: path.join(dirPath, entry.name),
    }));
    res.json(files);
  } catch (err) {
    if (err.code === 'ENOENT') return res.status(404).json({ error: 'Path not found' });
    res.status(500).json({ error: err.message });
  }
});

// POST /api/upload - Upload/create file
router.post('/upload', (req, res) => {
  try {
    const { path: filePath } = req.body;
    if (!filePath) return res.status(400).json({ error: 'Path is required' });
    const safePath = path.normalize(path.join(ROOT_DIR, filePath));
    if (!safePath.startsWith(ROOT_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const dir = path.dirname(safePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(safePath, req.body.content || '');
    res.json({ path: filePath, created: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/download?path= - Download file
router.get('/download', (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath) return res.status(400).json({ error: 'Path is required' });
    const safePath = path.normalize(path.join(ROOT_DIR, filePath));
    if (!safePath.startsWith(ROOT_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (!fs.existsSync(safePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.download(safePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/directory - Create directory
router.post('/directory', (req, res) => {
  try {
    const { path: dirPath } = req.body;
    if (!dirPath) return res.status(400).json({ error: 'Path is required' });
    const safePath = path.normalize(path.join(ROOT_DIR, dirPath));
    if (!safePath.startsWith(ROOT_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (fs.existsSync(safePath)) {
      return res.status(409).json({ error: 'Directory already exists' });
    }
    fs.mkdirSync(safePath, { recursive: true });
    res.status(201).json({ path: dirPath, created: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
