const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');

// AI provider configurations
const AI_PROVIDERS = {
  opencode: {
    name: 'OpenCode',
    url: process.env.AI_OPENCODE_URL || 'http://localhost:8082',
  },
  claude: {
    name: 'Claude',
    url: process.env.AI_CLAUDE_URL || 'https://api.anthropic.com',
    apiKey: process.env.AI_CLAUDE_API_KEY,
  },
  codex: {
    name: 'Codex',
    url: process.env.AI_CODEX_URL || 'https://api.openai.com',
    apiKey: process.env.AI_CODEX_API_KEY,
  },
  gemini: {
    name: 'Gemini',
    url: process.env.AI_GEMINI_URL || 'https://generativelanguage.googleapis.com',
    apiKey: process.env.AI_GEMINI_API_KEY,
  },
  openrouter: {
    name: 'OpenRouter',
    url: process.env.AI_OPENROUTER_URL || 'https://openrouter.ai/api',
    apiKey: process.env.AI_OPENROUTER_API_KEY,
  },
};

// GET /api/ai/providers - List available providers
router.get('/providers', (req, res) => {
  const providers = Object.entries(AI_PROVIDERS).map(([id, config]) => ({
    id,
    name: config.name,
    configured: !!config.apiKey || id === 'opencode',
  }));
  res.json(providers);
});

// GET /api/ai/models - List available models
router.get('/models', async (req, res) => {
  const provider = req.query.provider || 'opencode';
  const config = AI_PROVIDERS[provider];
  if (!config) return res.status(400).json({ error: 'Unknown provider' });

  // Return a basic list since we can't always query external APIs
  const models = {
    opencode: [
      { id: 'default', name: 'Default Model' },
    ],
    claude: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
    ],
    codex: [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
    ],
    gemini: [
      { id: 'gemini-pro', name: 'Gemini Pro' },
    ],
    openrouter: [
      { id: 'auto', name: 'Auto (OpenRouter)' },
    ],
  };

  res.json(models[provider] || []);
});

// POST /api/ai/chat - Send chat message to AI provider
router.post('/chat', async (req, res) => {
  try {
    const { provider = 'opencode', model, messages, prompt } = req.body;
    const config = AI_PROVIDERS[provider];
    if (!config) return res.status(400).json({ error: 'Unknown provider' });

    // For now, return a placeholder response
    // In production, this would proxy to the actual AI provider
    res.json({
      provider,
      model: model || 'default',
      response: `[AI proxy placeholder] Provider: ${config.name}. Configure API key to enable.`,
      usage: { prompt_tokens: 0, completion_tokens: 0 },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
