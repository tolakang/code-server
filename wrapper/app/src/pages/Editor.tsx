import React from 'react';
import { Box } from '@mui/material';

const CODE_SERVER_URL = '/absproxy/?folder=/home/coder/project';

const Editor = () => {
  const { isMobile } = useMobile();
  
  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      '@media (max-width: 600px)': {
        height: 'calc(100vh - 50px)',
      }
    }}>
      <iframe
        src={CODE_SERVER_URL}
        title="Code Editor"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          flex: 1,
          minHeight: isMobile ? 'calc(100vh - 100px)' : '100%',
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </Box>
  );
};

export default Editor;
