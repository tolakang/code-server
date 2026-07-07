import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import { connectToMCPServer, MCPServerConfig, MCPServerStatus } from '../api/mcpApi';

const MCPServer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [serverConfig, setServerConfig] = useState<MCPServerConfig>({
    host: 'localhost',
    port: 8080,
    apiKey: '',
    enabled: false
  });
  const [serverStatus, setServerStatus] = useState<MCPServerStatus | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');

  const toggleMCPServer = () => {
    setIsOpen(!isOpen);
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setServerConfig(prev => ({ ...prev, [name]: value }));
  };

  const connectToServer = async () => {
    try {
      const status = await connectToMCPServer(serverConfig);
      setServerStatus(status);
      setConnectionStatus('Connected');
      alert('Successfully connected to MCP server');
    } catch (error) {
      console.error('Error connecting to MCP server:', error);
      setConnectionStatus('Connection Failed');
      alert('Failed to connect to MCP server');
    }
  };

  return (
    <Box>
      <IconButton onClick={toggleMCPServer} sx={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000 }}>
        <SettingsIcon sx={{ fontSize: 40 }} color={serverConfig.enabled ? 'primary' : 'default'} />
      </IconButton>

      {isOpen && (
        <Dialog open={isOpen} onClose={toggleMCPServer} fullWidth maxWidth="sm">
          <DialogTitle>MCP Server Configuration</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Configure your MCP server connection
            </Typography>

            <TextField
              label="Host"
              name="host"
              value={serverConfig.host}
              onChange={handleConfigChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Port"
              name="port"
              type="number"
              value={serverConfig.port}
              onChange={handleConfigChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="API Key"
              name="apiKey"
              type="password"
              value={serverConfig.apiKey}
              onChange={handleConfigChange}
              fullWidth
              margin="normal"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={serverConfig.enabled}
                  onChange={(e) => setServerConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                />
              }
              label="Enable MCP Server Integration"
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              onClick={connectToServer}
              disabled={!serverConfig.enabled}
              sx={{ mb: 2 }}
            >
              Connect
            </Button>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Connection Status: {connectionStatus}
            </Typography>

            {serverStatus && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Server Info:</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Status" secondary={serverStatus.status} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Version" secondary={serverStatus.version} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Uptime" secondary={serverStatus.uptime} />
                  </ListItem>
                </List>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleMCPServer}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default MCPServer;