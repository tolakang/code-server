import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, ListItemButton, IconButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const FileBrowser = () => {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    // Fetch files from code-server API
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api/files?path=${encodeURIComponent(currentPath)}`);
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [currentPath]);

  const handleFileClick = (file) => {
    if (file.type === 'directory') {
      setCurrentPath(`${currentPath}${file.name}/`);
    } else {
      // Handle file click (e.g., open in editor)
      console.log('File clicked:', file.name);
    }
  };

  const handleBack = () => {
    const pathParts = currentPath.split('/').filter(part => part !== '');
    if (pathParts.length > 0) {
      pathParts.pop();
      setCurrentPath(`/${pathParts.join('/')}/`);
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px', backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6">File Browser</Typography>
        {currentPath !== '/' && (
          <IconButton onClick={handleBack} sx={{ marginLeft: 'auto' }}>
            <FolderIcon />
          </IconButton>
        )}
      </Box>
      <List>
        {files.map((file) => (
          <ListItem key={file.name} disablePadding>
            <ListItemButton onClick={() => handleFileClick(file)}>
              <ListItemIcon>
                {file.type === 'directory' ? <FolderIcon /> : <InsertDriveFileIcon />}
              </ListItemIcon>
              <ListItemText primary={file.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FileBrowser;