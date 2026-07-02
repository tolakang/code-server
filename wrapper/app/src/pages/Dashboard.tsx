import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '16px' }}>
      <h1>Welcome to Mobile Code Server</h1>
      <div style={{ margin: '16px 0' }}>
        <h2>Quick Start</h2>
        <button style={{ margin: '8px 0', padding: '8px 16px' }}>
          Open Editor
        </button>
        <button style={{ margin: '8px 0', padding: '8px 16px' }}>
          Explore Files
        </button>
      </div>
      <p>
        Your mobile-first development environment is ready.
        Use the bottom navigation to switch between editor, terminal, and file explorer.
      </p>
    </div>
  );
};

export default Dashboard;
