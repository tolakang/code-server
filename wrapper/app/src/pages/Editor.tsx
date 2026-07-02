import React from 'react';

const Editor = () => {
  return (
    <div style={{ padding: '16px' }}>
      <h1>Editor</h1>
      <p>This is where the code editor will be embedded.</p>
      {/* In the future, we might embed the code-server via iframe or webview */}
      <div style={{ border: '1px solid #ccc', height: '500px', marginTop: '16px' }}>
        {/* Placeholder for editor */}
        <div style={{ textAlign: 'center', paddingTop: '200px', color: '#666' }}>
          Code Editor Placeholder
        </div>
      </div>
    </div>
  );
};

export default Editor;
