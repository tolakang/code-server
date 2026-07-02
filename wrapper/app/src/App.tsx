import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import TerminalIcon from '@mui/icons-material/Terminal';
import FolderIcon from '@mui/icons-material/Folder';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Terminal from './pages/Terminal';
import Explorer from './pages/Explorer';
import AIAssistant from './components/AIAssistant';

function App() {
  const navigate = useNavigate();

  return (
    <>
      <AIAssistant />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box flex={1} overflow="auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/terminal" element={<Terminal />} />
            <Route path="/explorer" element={<Explorer />} />
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
        </BottomNavigation>
      </Box>
    </>
  );
}

export default App;