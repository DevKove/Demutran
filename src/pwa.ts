const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

if ('serviceWorker' in navigator && (import.meta.env.PROD || isLocalhost)) {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL;
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base })
      .catch((error: unknown) => console.error('[DEMUTRAN] Falha ao registrar o PWA:', error));
  });
}
