import { createRoot } from 'react-dom/client';
import HeroScene from './components/HeroScene';
import './error-robot.css';

const root = document.getElementById('error-robot-root');

if (root) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const errorCode = Number(document.body.dataset.errorCode) || 404;
  createRoot(root).render(<HeroScene paused={reducedMotion} errorMode errorCode={errorCode} />);
}
