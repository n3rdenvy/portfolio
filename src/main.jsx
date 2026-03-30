import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Agentation } from 'agentation';
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

const showAgentation =
  import.meta.env.DEV ||
  new URLSearchParams(window.location.search).has('agentation');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <App />
      {showAgentation ? <Agentation /> : null}
    </>
  </StrictMode>,
);
