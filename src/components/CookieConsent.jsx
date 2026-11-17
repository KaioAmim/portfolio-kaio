import { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';

const KEY = 'kaio-privacy-consent';
const VERSION = '1.1';

function readConsent() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}

function enableAnalytics() {
  if (document.querySelector('[data-vercel-insights]')) return;
  const script = document.createElement('script');
  script.src = '/_vercel/insights/script.js';
  script.defer = true;
  script.dataset.vercelInsights = 'true';
  document.head.appendChild(script);
}

export default function CookieConsent() {
  const [consent, setConsent] = useState(readConsent);
  const [open, setOpen] = useState(() => {
    const saved = readConsent();
    return !saved || saved.version !== VERSION;
  });
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    if (consent?.analytics) enableAnalytics();
  }, [consent]);

  const save = (allowAnalytics) => {
    const value = { version: VERSION, necessary: true, analytics: allowAnalytics, decidedAt: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(value)); } catch { /* Analytics remains off if the choice cannot be saved. */ }
    setConsent(value);
    setOpen(false);
    setSettings(false);
  };

  if (!open) return null;

  return <div className="privacy-layer" role="region" aria-label="Preferências de privacidade">
    <section className="privacy-panel" aria-labelledby="cookie-title">
      <button className="privacy-close" aria-label="Fechar aviso" onClick={() => save(false)}><X size={18}/></button>
      <p className="section-kicker cookie-kicker"><Cookie size={17} aria-hidden="true"/>Cookies e privacidade</p>
      <h2 id="cookie-title">Sua escolha sobre cookies</h2>
      <p>Usamos armazenamento necessário para lembrar preferências e, somente com sua autorização, analytics da Vercel para entender visitas ao portfólio. Você pode recusar ou mudar de ideia depois.</p>
      <div className="privacy-links"><a href="/politica-de-privacidade.html" target="_blank" rel="noreferrer">Política de Privacidade</a><a href="/politica-de-cookies.html" target="_blank" rel="noreferrer">Política de Cookies</a></div>
      {settings && <div className="cookie-choice"><span><strong>Necessários</strong><small>Preferência de tema e registro das suas escolhas. Sempre ativos.</small></span><span className="cookie-on">Ativos</span><label><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)}/><span><strong>Analytics</strong><small>Métricas de uso fornecidas pela Vercel, apenas após autorização.</small></span></label></div>}
      <div className="privacy-actions">
        {!settings ? <>
          <button className="button button-primary" onClick={() => save(true)}>Aceitar todos</button>
          <button className="button button-outline" onClick={() => save(false)}>Recusar todos</button>
          <button className="button button-outline" onClick={() => {setAnalytics(false);setSettings(true)}}>Personalizar</button>
        </> : <>
          <button className="button button-primary" onClick={() => save(analytics)}>Salvar preferências</button>
          <button className="button button-outline" onClick={() => setSettings(false)}>Voltar</button>
        </>}
      </div>
      <small className="privacy-record-note">Sua escolha e a data ficam salvas neste navegador. Nenhum nome é registrado.</small>
    </section>
  </div>;
}
