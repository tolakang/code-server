import axios from 'axios';

const MCP_API_BASE_URL = '/api/mcp';

export interface MCPServerConfig {
  host: string;
  port: number;
  apiKey: string;
  enabled: boolean;
}

export interface MCPServerStatus {
  status: string;
  version: string;
  uptime: string;
  connectedAgents: number;
}

export const connectToMCPServer = async (config: MCPServerConfig): Promise<MCPServerStatus> => {
  try {
    const response = await axios.post(`${MCP_API_BASE_URL}/connect`, config);
    return response.data;
  } catch (error) {
    console.error('Error connecting to MCP server:', error);
    throw error;
  }
};

export const getMCPStatus = async (): Promise<MCPServerStatus> => {
  try {
    const response = await axios.get(`${MCP_API_BASE_URL}/status`);
    return response.data;
  } catch (error) {
    console.error('Error getting MCP server status:', error);
    throw error;
  }
};

export const sendToMCP = async (message: string): Promise<any> => {
  try {
    const response = await axios.post(`${MCP_API_BASE_URL}/send`, { message });
    return response.data;
  } catch (error) {
    console.error('Error sending to MCP server:', error);
    throw error;
  }
};

export const getMCPModels = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${MCP_API_BASE_URL}/models`);
    return response.data.models;
  } catch (error) {
    console.error('Error getting MCP models:', error);
    throw error;
  }
};