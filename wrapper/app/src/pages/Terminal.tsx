import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { Box, Typography } from '@mui/material';

const TerminalComponent = () => {
  const [output, setOutput] = useState('');
  const terminalRef = useRef(null);
  const terminal = useRef(null);
  const fitAddon = useRef(new FitAddon());

  useEffect(() => {
    // Initialize terminal
    terminal.current = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#000',
        foreground: '#0f0'
      }
    });

    // Load addons
    terminal.current.loadAddon(fitAddon.current);
    terminal.current.open(terminalRef.current);
    fitAddon.current.fit();

    // Write initial message
    terminal.current.write('Welcome to Mobile Code Server Terminal\r\n');

    // Connect to code-server terminal API
    const socket = new WebSocket(`ws://${window.location.host}/api/terminal`);

    socket.onopen = () => {
      terminal.current.write('Connected to server\r\n');
    };

    socket.onmessage = (event) => {
      terminal.current.write(event.data);
    };

    socket.onclose = () => {
      terminal.current.write('Disconnected from server\r\n');
    };

    // Handle terminal input
    terminal.current.onData((data) => {
      socket.send(data);
    });

    // Handle window resize
    const handleResize = () => {
      fitAddon.current.fit();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      socket.close();
      terminal.current.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box sx={{ height: '100%', width: '100%', backgroundColor: '#000', color: '#0f0' }}>
      <Typography variant="h6" sx={{ padding: '8px', backgroundColor: '#333' }}>Terminal</Typography>
      <Box ref={terminalRef} sx={{ height: 'calc(100% - 56px)', overflow: 'auto' }} />
    </Box>
  );
};

export default TerminalComponent;