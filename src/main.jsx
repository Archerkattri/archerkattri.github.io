import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './grid.css';

// Drop the build-time prerendered fallback before mounting the app.
const container = document.getElementById('root');
container.textContent = '';

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
