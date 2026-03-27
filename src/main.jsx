import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './globals.css';
import App from './App.jsx';

(function syncInitialBgDepth() {
  const path = window.location.pathname;
  if (path !== '/') {
    document.documentElement.dataset.bgDepth = '2';
    return;
  }
  const wing = new URLSearchParams(window.location.search).get('wing');
  document.documentElement.dataset.bgDepth = wing === 'east' ? '1' : '0';
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
