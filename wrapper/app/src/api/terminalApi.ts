import { Terminal } from '@xterm/xterm';

let terminalSocket: WebSocket | null = null;
let terminalInstance: Terminal | null = null;

/**
 * Connect to terminal WebSocket
 * @param terminal - XTerm terminal instance
 * @param onData - Callback for terminal input
 */
export const connectTerminal = (terminal: Terminal, onData?: (data: string) => void) => {
  const socketUrl = `ws://${window.location.host}/api/terminal`;
  terminalSocket = new WebSocket(socketUrl);

  terminalInstance = terminal;

  terminalSocket.onopen = () => {
    console.log('Terminal WebSocket connected');
    terminal.write('\r\nConnected to terminal server\r\n');
  };

  terminalSocket.onmessage = (event) => {
    terminal.write(event.data);
  };

  terminalSocket.onclose = () => {
    console.log('Terminal WebSocket disconnected');
    terminal.write('\r\nDisconnected from terminal server\r\n');
  };

  terminalSocket.onerror = (error) => {
    console.error('Terminal WebSocket error:', error);
    terminal.write('\r\nError connecting to terminal server\r\n');
  };

  // Handle terminal input
  if (onData) {
    terminal.onData((data) => {
      if (terminalSocket && terminalSocket.readyState === WebSocket.OPEN) {
        terminalSocket.send(data);
      }
    });
  }
};

/**
 * Disconnect terminal WebSocket
 */
export const disconnectTerminal = () => {
  if (terminalSocket) {
    terminalSocket.close();
    terminalSocket = null;
  }
  terminalInstance = null;
};

/**
 * Send command to terminal
 * @param command - Command to send
 */
export const sendTerminalCommand = (command: string) => {
  if (terminalSocket && terminalSocket.readyState === WebSocket.OPEN) {
    terminalSocket.send(command);
  }
};