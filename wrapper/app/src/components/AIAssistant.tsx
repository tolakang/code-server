import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { sendMessage, getAvailableModels } from '../api/aiApi';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{
    text: 'Hello! I am your AI assistant. How can I help you with your code?',
    isUser: false,
    model: 'system'
  }]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('opencode');
  const [availableModels, setAvailableModels] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const models = await getAvailableModels(selectedModel);
        setAvailableModels(models);
      } catch (error) {
        console.error('Error fetching available models:', error);
      }
    };
    fetchModels();
  }, [selectedModel]);

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    setMessages(prev => [...prev, { text: input, isUser: true, model: selectedModel }]);
    setInput('');

    try {
      const response = await sendMessage(selectedModel, input);

      setMessages(prev => [...prev, {
        text: response.response,
        isUser: false,
        model: response.model
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, there was an error processing your request.',
        isUser: false,
        model: 'error'
      }]);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Box>
      <IconButton onClick={toggleAssistant} sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        <ChatBubbleIcon sx={{ fontSize: 40 }} color={isOpen ? 'primary' : 'default'} />
      </IconButton>

      {isOpen && (
        <Box sx={{ position: 'fixed', bottom: 80, right: 20, width: 350, zIndex: 1001, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">AI Assistant</Typography>
            <IconButton onClick={toggleAssistant}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="model-select-label">AI Model</InputLabel>
            <Select
              labelId="model-select-label"
              id="model-select"
              value={selectedModel}
              label="AI Model"
              onChange={(e) => setSelectedModel(e.target.value as string)}
            >
              <MenuItem value="opencode">OpenCode</MenuItem>
              <MenuItem value="claude">Claude Code</MenuItem>
              <MenuItem value="codex">Codex</MenuItem>
              <MenuItem value="gemini">Gemini</MenuItem>
              {availableModels.filter(m => !['opencode', 'claude', 'codex', 'gemini'].includes(m.id)).map(m => (
                <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ height: 300, overflowY: 'auto', mb: 2 }}>
            <List>
              {messages.map((message, index) => (
                <ListItem key={index} alignItems="flex-start" sx={{ mb: 1 }}>
                  {message.isUser ? (
                    <Box sx={{ backgroundColor: '#007bff', color: 'white', borderRadius: 8, padding: '8px 12px', maxWidth: '80%' }}>
                      {message.text}
                    </Box>
                  ) : (
                    <Box sx={{ backgroundColor: '#f0f0f0', borderRadius: 8, padding: '8px 12px', maxWidth: '80%' }}>
                      <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem', color: 'text.secondary' }}>
                        {message.model}
                      </Typography>
                      {message.text}
                    </Box>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              endIcon={<SendIcon />}
              sx={{ mb: 1 }}
            >
              Send
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AIAssistant;