import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItemButton, ListItemText, Divider, CircularProgress } from '@mui/material';
import { getWorkspaces, switchWorkspace } from '../api/workspaceApi';

interface Workspace {
  id: string;
  name: string;
  path: string;
  username?: string;
}

const WorkspaceManager = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const data = await getWorkspaces();
        setWorkspaces(data);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = () => {
    console.log('Create new workspace');
  };

  const handleWorkspaceClick = async (workspace: Workspace) => {
    try {
      setSelectedId(workspace.id);
      await switchWorkspace(workspace.id);
      console.log('Switched to workspace:', workspace.name);
    } catch (error) {
      console.error('Error switching workspace:', error);
    } finally {
      setSelectedId(null);
    }
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : workspaces.length === 0 ? (
        <Typography variant="body1" color="text.secondary">No workspaces found. Create one to get started.</Typography>
      ) : (
        <List>
          {workspaces.map((workspace) => (
            <ListItemButton key={workspace.id} onClick={() => handleWorkspaceClick(workspace)} disabled={selectedId === workspace.id}>
              <ListItemText primary={workspace.name} secondary={workspace.path} />
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
};

export default WorkspaceManager;