import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import TerminalIcon from '@mui/icons-material/Terminal';
import FolderIcon from '@mui/icons-material/Folder';
import GroupIcon from '@mui/icons-material/Group';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Terminal from './pages/Terminal';
import Explorer from './pages/Explorer';
import Teams from './components/Teams';
import AIAssistant from './components/AIAssistant';
import MCPServer from './components/MCPServer';
import Notifications from './components/Notifications';
import AuditLogs from './components/AuditLogs';
import Users from './components/Users';

const navItems = [
  { label: 'Dashboard', value: 'dashboard', icon: <HomeIcon />, path: '/dashboard' },
  { label: 'Editor', value: 'editor', icon: <EditIcon />, path: '/editor' },
  { label: 'Terminal', value: 'terminal', icon: <TerminalIcon />, path: '/terminal' },
  { label: 'Explorer', value: 'explorer', icon: <FolderIcon />, path: '/explorer' },
  { label: 'Teams', value: 'teams', icon: <GroupIcon />, path: '/teams' },
];

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeNav = navItems.find(n => n.path === location.pathname)?.value || false;

  return (
    <>
      <AIAssistant />
      <MCPServer />
      <Notifications />
      <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <Box flex={1} overflow="auto">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/terminal" element={<Terminal />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/users" element={<Users />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Box>
        <BottomNavigation
          showLabels
          value={activeNav}
          onChange={(e, newValue) => {
            const item = navItems.find(n => n.value === newValue);
            if (item) navigate(item.path, { replace: true });
          }}
          aria-label="bottom navigation"
        >
          {navItems.map(item => (
            <BottomNavigationAction key={item.value} label={item.label} icon={item.icon} value={item.value} />
          ))}
        </BottomNavigation>
      </Box>
    </>
  );
}

export default App;