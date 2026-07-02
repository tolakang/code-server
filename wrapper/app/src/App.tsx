import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import TerminalIcon from '@mui/icons-material/Terminal';
import FolderIcon from '@mui/icons-material/Folder';
import GroupIcon from '@mui/icons-material/Group';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Terminal from './pages/Terminal';
import Explorer from './pages/Explorer';
import Teams from './components/Teams';
import AIAssistant from './components/AIAssistant';
import MCPServer from './components/MCPServer';
import Notifications from './components/Notifications';
import AuditLogs from './components/AuditLogs';

function App() {
  const navigate = useNavigate();

  return (
    <>
      <AIAssistant />
      <MCPServer />
      <Notifications />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box flex={1} overflow="auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/terminal" element={<Terminal />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Box>
        <BottomNavigation
          showLabels
          value="dashboard"
          onChange={(e, newValue) => {
            let path = '/dashboard';
            switch (newValue) {
              case 'dashboard':
                path = '/dashboard';
                break;
              case 'editor':
                path = '/editor';
                break;
              case 'terminal':
                path = '/terminal';
                break;
              case 'explorer':
                path = '/explorer';
                break;
              case 'teams':
                path = '/teams';
                break;
              default:
                path = '/dashboard';
            }
            navigate(path, { replace: true });
          }}
          aria-label="bottom navigation"
        >
          <BottomNavigationAction label="Dashboard" icon={<HomeIcon />} value="dashboard" />
          <BottomNavigationAction label="Editor" icon={<EditIcon />} value="editor" />
          <BottomNavigationAction label="Terminal" icon={<TerminalIcon />} value="terminal" />
          <BottomNavigationAction label="Explorer" icon={<FolderIcon />} value="explorer" />
          <BottomNavigationAction label="Teams" icon={<GroupIcon />} value="teams" />
        </BottomNavigation>
      </Box>
    </>
  );
}

export default App;