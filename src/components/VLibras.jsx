import { useEffect } from 'react';

export default function VLibras() {
  useEffect(() => {
    let readyObserver;
    let toggleRetry;
    let appRootPoll;
    let boundAppShadow;

    const getWidgetButton = () => {
      const wrappers = [...document.querySelectorAll('#vlibras-access-wrapper')];
      const launcher = wrappers.find(
        (host) => host.shadowRoot?.querySelector('#vlibras-access')?.getAttribute('style') !== 'display: none;',
      );
      return launcher?.shadowRoot?.querySelector('#vlibras-button');
    };

    const toggleWidget = (open) => {
      const closeButton = document
        .querySelector('#vlibras-app-root')
        ?.shadowRoot?.querySelector('button[aria-label="Fechar"]');
      const button = open ? getWidgetButton() : closeButton;
      if (button) {
        button.click();
        return true;
      }

      return false;
    };

    const handleToggleRequest = (event) => {
      const open = event.detail?.open;
      if (toggleWidget(open)) return;

      let attempts = 0;
      toggleRetry = window.setInterval(() => {
        attempts += 1;
        if (toggleWidget(open) || attempts >= 30) window.clearInterval(toggleRetry);
      }, 100);
    };

    const bindAppClose = () => {
      const shadow = document.querySelector('#vlibras-app-root')?.shadowRoot;
      if (!shadow || shadow === boundAppShadow) return Boolean(shadow);
      boundAppShadow = shadow;
      shadow.addEventListener('click', (event) => {
        const closeClicked = event.composedPath().some(
          (node) => node instanceof HTMLButtonElement && node.getAttribute('aria-label') === 'Fechar',
        );
        if (closeClicked) window.dispatchEvent(new Event('portfolio:vlibras-closed'));
      });
      return true;
    };

    const observeWidget = () => {
      if (bindAppClose()) return;
      readyObserver = new MutationObserver(() => {
        if (bindAppClose()) readyObserver.disconnect();
      });
      readyObserver.observe(document.body, { childList: true, subtree: true });
      let attempts = 0;
      appRootPoll = window.setInterval(() => {
        attempts += 1;
        if (bindAppClose() || attempts >= 120) window.clearInterval(appRootPoll);
      }, 250);
    };

    window.addEventListener('portfolio:toggle-vlibras', handleToggleRequest);

    let script = document.querySelector('script[data-vlibras]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.defer = true;
      script.dataset.vlibras = 'true';
      script.onload = observeWidget;
      document.body.appendChild(script);
    } else {
      observeWidget();
    }

    return () => {
      window.removeEventListener('portfolio:toggle-vlibras', handleToggleRequest);
      if (toggleRetry) window.clearInterval(toggleRetry);
      if (appRootPoll) window.clearInterval(appRootPoll);
      readyObserver?.disconnect();
      script?.remove();
      document.querySelectorAll('#vlibras-access-wrapper, #vlibras-app-root, .enabled').forEach((node) => node.remove());
    };
  }, []);

  return null;
}
