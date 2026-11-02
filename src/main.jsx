import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/syne/latin-400.css';
import '@fontsource/syne/latin-500.css';
import '@fontsource/syne/latin-600.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import App from './App.jsx';
import './styles.css';
import './experience.css';
import './violet.css';
import './reference.css';
import './theme-refinements.css';
import './brand.css';
import './content-refresh.css';
import { AppErrorBoundary, ConnectionGuard } from './components/StatusPage';

createRoot(document.getElementById('root')).render(<React.StrictMode><AppErrorBoundary><ConnectionGuard><App /></ConnectionGuard></AppErrorBoundary></React.StrictMode>);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
