import { initNavigation } from './navigation';

const root = document.documentElement;

if (root.classList.contains('js')) {
  root.classList.add('js-ready');
  initNavigation();

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasScenes = document.querySelector('[data-scene]') !== null;

  if (!reduced && hasScenes) {
    import('./motion/index')
      .then(({ startMotion }) => {
        const stop = startMotion();
        window.addEventListener('pagehide', stop, { once: true });
      })
      .catch(() => {
        root.classList.remove('js');
      });
  }
}
