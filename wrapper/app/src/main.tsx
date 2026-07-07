import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { MobileProvider } from './context/MobileContext';
import { AuthProvider } from './hooks/useAuth';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MobileProvider>
          <App />
        </MobileProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
