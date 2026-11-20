import { useEffect } from 'react';

export default function VLibras() {
  useEffect(() => {
    if (document.querySelector('script[data-vlibras]')) return;
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.defer = true;
    script.dataset.vlibras = 'true';
    script.onload = () => {
      if (window.VLibras?.Widget) new window.VLibras.Widget('https://vlibras.gov.br/app');
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
      document.querySelector('.enabled')?.remove();
    };
  }, []);

  return (
    <div vw="" className="enabled">
      <div vw-access-button="" className="active" />
      <div vw-plugin-wrapper="">
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}
