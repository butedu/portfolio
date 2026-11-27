(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const started = performance.now();
  let overlay = null;
  let loaded = false;
  let leaving = false;
  let uncovered = false;
  let readySent = false;
  root.classList.add('portfolio-loading');

  function ready() {
    if (loaded && uncovered && !readySent) {
      readySent = true;
      window.dispatchEvent(new CustomEvent('portfolio:ready'));
    }
  }
  function reveal() {
    if (leaving) return;
    leaving = true;
    root.classList.remove('portfolio-loading');
    if (!overlay) { uncovered = true; ready(); return; }
    overlay.classList.add('is-leaving');
    window.setTimeout(() => { overlay.remove(); uncovered = true; ready(); }, reduced ? 0 : 430);
  }
  function addOverlay() {
    if (leaving || !document.body) return;
    const en = root.lang === 'en';
    overlay = document.createElement('div');
    overlay.className = 'portfolio-preloader';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-label', en ? 'Preparing portfolio' : 'Đang chuẩn bị portfolio');
    overlay.innerHTML = '<div class="loader-center"><div class="loader-emblem" aria-hidden="true"><span class="loader-mark">td</span></div><p class="loader-name">TRƯỜNG DUY</p><p class="loader-copy"></p><span class="loader-track" aria-hidden="true"></span></div>';
    overlay.querySelector('.loader-copy').textContent = en ? 'Preparing your experience' : 'Đang chuẩn bị trải nghiệm';
    document.body.prepend(overlay);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addOverlay, { once: true });
  else addOverlay();
  window.addEventListener('load', () => {
    loaded = true;
    if (uncovered) { ready(); return; }
    if (!leaving) window.setTimeout(reveal, Math.max(0, (reduced ? 180 : 900) - (performance.now() - started)));
  }, { once: true });
  // A slow or failed asset must never leave the content inaccessible.
  window.setTimeout(reveal, 4000);
  window.addEventListener('pageshow', event => { if (event.persisted) reveal(); });
})();
