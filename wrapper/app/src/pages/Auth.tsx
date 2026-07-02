import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Auth = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() !== '') {
      login({ id: 1, username: username.trim() });
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ padding: '16px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Sign in to Mobile Code Server</h1>
      <div style={{ margin: '16px 0' }}>
        <label htmlFor="username" style={{ display: 'block', marginBottom: '8px' }}>
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px',
          }}
        />
      </div>
      <button
        onClick={handleLogin}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
        disabled={username.trim() === ''}
      >
        Sign in
      </button>
    </div>
  );
};

export default Auth;
