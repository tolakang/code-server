import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, List, ListItem, ListItemText } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{
    text: 'Hello! I am your AI assistant. How can I help you with your code?',
    isUser: false,
  }]);
  const [input, setInput] = useState('');

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (input.trim() === '') return;

    // Add user message
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: `I received your message: ${input}. This is a simulated AI response.`,
        isUser: false,
      }]);
    }, 500);
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
              placeholder="Type your message..."
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
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