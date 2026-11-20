import { createRoot } from 'react-dom/client';
import '@fontsource/syne/latin-400.css';
import '@fontsource/syne/latin-500.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import './styles.css';
import { StatusPage } from './components/StatusPage';

createRoot(document.getElementById('recovery-root')).render(
  <StatusPage onRetry={() => window.location.assign('/')} />,
);
