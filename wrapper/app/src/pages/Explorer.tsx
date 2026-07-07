import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, ListItemButton, IconButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const FileBrowser = () => {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('/');
  const { isMobile } = useMobile();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api/files?path=${encodeURIComponent(currentPath)}`);
        if (!response.ok) {
          console.error('Error fetching files:', response.statusText);
          setFiles([]);
          return;
        }
        const data = await response.json();
        setFiles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching files:', error);
        setFiles([]);
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
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: isMobile ? '4px 8px' : '8px', 
        backgroundColor: '#f5f5f5'
      }}>
        <Typography variant="h6" sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>File Browser</Typography>
        {currentPath !== '/' && (
          <IconButton onClick={handleBack} sx={{ marginLeft: 'auto', padding: isMobile ? '4px' : '8px' }}>
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