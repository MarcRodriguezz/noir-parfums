import { motionQueries } from '@/lib/motion-profile';

const MOBILE_NAV = '(max-width: 47.99rem)';

function initMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const label = document.querySelector<HTMLElement>('[data-menu-label]');
  if (!toggle || !menu || !label) return;

  const outside = document.querySelectorAll<HTMLElement>('main, footer');
  const mobile = window.matchMedia(MOBILE_NAV);

  const setOpen = (open: boolean, restoreFocus = false): void => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.dataset['open'] = String(open);
    label.textContent = open ? 'Close' : 'Menu';
    document.documentElement.classList.toggle('menu-open', open);
    outside.forEach((element) => {
      element.inert = open;
    });
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
  });

  mobile.addEventListener('change', (event) => {
    if (!event.matches) setOpen(false);
  });
}

function initActiveLink(): void {
  const links = new Map<string, HTMLAnchorElement>();
  document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]').forEach((link) => {
    const id = link.hash.slice(1);
    if (id && document.getElementById(id)) links.set(id, link);
  });
  if (links.size === 0) return;

  const inView = new Set<string>();
  const order = [...links.keys()];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) inView.add(entry.target.id);
        else inView.delete(entry.target.id);
      });
      const current = order.filter((id) => inView.has(id)).at(-1);
      links.forEach((link, id) => {
        if (id === current) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );

  order.forEach((id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

function initHeaderBackdrop(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;

  const clearScenes = document.querySelectorAll<HTMLElement>('[data-clear-header]');
  const cinema = window.matchMedia(motionQueries.cinema);
  const underHeader = new Set<Element>();

  const update = (): void => {
    const clear = [...underHeader].some(
      (scene) => scene.getAttribute('data-clear-header') === 'always' || cinema.matches,
    );
    header.dataset['solid'] = String(!clear);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) underHeader.add(entry.target);
        else underHeader.delete(entry.target);
      });
      update();
    },
    { rootMargin: '-1px 0px -99% 0px' },
  );

  clearScenes.forEach((scene) => {
    observer.observe(scene);
  });
  cinema.addEventListener('change', update);
  update();
}

export function initNavigation(): void {
  initMenu();
  initActiveLink();
  initHeaderBackdrop();
}
