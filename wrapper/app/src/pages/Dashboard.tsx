import React from 'react';
import { Box, Typography, Button, List, ListItemButton, ListItemText, Divider } from '@mui/material';

const WorkspaceManager = () => {
  const [workspaces, setWorkspaces] = React.useState([
    { id: '1', name: 'Default Workspace', path: '/project' },
    { id: '2', name: 'Mobile Development', path: '/project/mobile' },
  ]);

  const handleCreateWorkspace = () => {
    // TODO: Implement workspace creation
    console.log('Create new workspace');
  };

  const handleWorkspaceClick = (workspace) => {
    // TODO: Switch to workspace
    console.log('Switch to workspace:', workspace.name);
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography variant="h5" gutterBottom>
        Workspace Manager
      </Typography>

      <Button variant="contained" onClick={handleCreateWorkspace} sx={{ mb: 2 }}>
        Create New Workspace
      </Button>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Available Workspaces
      </Typography>

      <List>
        {workspaces.map((workspace) => (
          <ListItemButton key={workspace.id} onClick={() => handleWorkspaceClick(workspace)}>
            <ListItemText primary={workspace.name} secondary={workspace.path} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default WorkspaceManager;