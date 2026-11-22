import { resolveRoute } from './navigation/routes.mjs';
import { galaxyObjects } from './content/projects.mjs';
import { pageTitle, renderAstroFocus, renderSite } from './ui/views.mjs';
import { drawStars, runGalaxyFlight } from './motion.mjs';
import { cancelCamera, focusAstro } from './camera.mjs';
import { createExpandedMap } from './expanded-map.mjs';

const root = document.querySelector('#site');
const config = { base: root.dataset.base, cv: root.dataset.cv === 'true' };
const languageKey = 'gabriel-endres-language';
let language = 'pt';
let removeStars = () => {};
let cancelFlight = () => {};
let entryNumber = 0;
const newEntry = () => ({
  portfolioEntry: `${performance.timeOrigin}-${++entryNumber}`,
  expanded: false, selected: null, normalScroll: 0,
});
let entry = history.state?.portfolioEntry ? { ...history.state } : newEntry();
let route;
let objects = [];
const positions = new Map();
const setExpanded = createExpandedMap(root, () => toggleExpanded(false));

try {
  if (localStorage.getItem(languageKey) === 'en') language = 'en';
} catch {
  // The selector still works when local storage is unavailable.
}

function saveEntry() {
  history.replaceState(entry, '');
}

function mapScroll() {
  return {
    page: window.scrollY,
    stage: root.querySelector('main').scrollTop,
    scene: root.querySelector('.galaxy-scene')?.scrollTop ?? 0,
    objects: root.querySelector('.planet-grid')?.scrollTop ?? 0,
  };
}

function restoreScroll(position) {
  if (!position) return;
  window.scrollTo(0, position.page);
  root.querySelector('main').scrollTop = position.stage;
  const scene = root.querySelector('.galaxy-scene');
  if (scene) scene.scrollTop = position.scene;
  const grid = root.querySelector('.planet-grid');
  if (grid) grid.scrollTop = position.objects;
}

function selectAstro(id, { animate = true, moveFocus = false, reveal = false } = {}) {
  const scene = root.querySelector('.galaxy-scene');
  if (!scene) return;
  const object = objects.find((item) => item.project && item.id === id);
  const panel = scene.querySelector('[data-astro-focus]');
  let selectedButton;

  cancelCamera(scene);
  for (const button of scene.querySelectorAll('[data-astro-id]')) {
    const selected = Boolean(object && button.dataset.astroId === id);
    button.setAttribute('aria-pressed', String(selected));
    if (selected) selectedButton = button;
  }

  panel.hidden = !object;
  panel.innerHTML = object ? renderAstroFocus(object, language, config.base) : '';
  entry.selected = object?.id ?? null;
  if (!selectedButton) return;

  focusAstro(scene, selectedButton, { animate });
  if (reveal) panel.querySelector('[data-map-project]').scrollIntoView({ block: 'nearest', inline: 'nearest' });
  if (moveFocus) panel.querySelector('[data-map-project]').focus({ preventScroll: true });
}

function render() {
  route = resolveRoute(location.pathname, config.base);
  objects = route.type === 'galaxy' ? galaxyObjects(route.category.id) : [];
  document.documentElement.lang = language === 'pt' ? 'pt-PT' : 'en';
  document.title = pageTitle(route, language);
  removeStars();
  cancelFlight();
  cancelCamera(root.querySelector('.galaxy-scene'));
  root.innerHTML = renderSite(route, language, { ...config, hash: location.hash });
  setExpanded(Boolean(entry.expanded && (route.type === 'home' || route.type === 'galaxy')));
  if (entry.selected) selectAstro(entry.selected, { animate: false });
  removeStars = drawStars(root.querySelector('.ambience'));
}

function scrollToView(position) {
  const isIndex = location.hash === '#projetos';
  const selected = root.querySelector('[data-astro-id][aria-pressed="true"]');
  const heading = document.getElementById(isIndex ? 'index-title'
    : route.type === 'home' && entry.expanded ? 'map-title' : 'page-title');
  (selected ?? heading)?.focus({ preventScroll: true });

  if (position) restoreScroll(position);
  else if (isIndex) document.getElementById('projetos')?.scrollIntoView();
  else window.scrollTo(0, 0);
}

function navigate(event, link) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (link.origin !== location.origin || link.target) return;
  event.preventDefault();

  if (link.hasAttribute('data-map-return') && entry.returnTo === link.href) {
    history.back();
    return;
  }

  const source = link.querySelector('.galaxy-image');
  const before = source?.getBoundingClientRect();
  if (link.href === location.href) {
    scrollToView();
    return;
  }
  const from = location.href;
  const nextRoute = resolveRoute(link.pathname, config.base);
  const expanded = Boolean(entry.expanded && (nextRoute.type === 'galaxy'
    || (nextRoute.type === 'home' && !link.hash)));
  positions.set(entry.portfolioEntry, mapScroll());
  entry = { ...newEntry(), expanded };
  if (link.hasAttribute('data-map-project')) entry.returnTo = from;
  history.pushState(entry, '', link.href);
  render();
  scrollToView();
  if (before) cancelFlight = runGalaxyFlight(source, before, root.querySelector('.galaxy-scene'));
}

function toggleExpanded(expanded) {
  const toggle = root.querySelector('[data-map-toggle]');
  if (!toggle || Boolean(entry.expanded) === expanded) return;
  if (expanded) entry.normalScroll = window.scrollY;
  entry.expanded = expanded;
  saveEntry();
  setExpanded(expanded, { requestNative: expanded });
  if (!expanded) window.scrollTo(0, entry.normalScroll ?? 0);
  toggle.focus({ preventScroll: true });
}

function resetSelection() {
  const previous = root.querySelector('[data-astro-id][aria-pressed="true"]');
  selectAstro(null);
  saveEntry();
  previous?.focus();
}

history.scrollRestoration = 'manual';
saveEntry();
document.documentElement.classList.add('interactive');
render();
if (location.hash === '#projetos') scrollToView();

root.addEventListener('click', (event) => {
  if (event.target.closest('.skip-link')) {
    event.preventDefault();
    root.querySelector('main').focus({ preventScroll: true });
    root.querySelector('main').scrollIntoView();
    return;
  }

  const button = event.target.closest('[data-language]');
  if (button) {
    const selected = button.dataset.language;
    if (selected === language) return;
    const scroll = mapScroll();
    language = selected;
    try { localStorage.setItem(languageKey, language); } catch { /* Use the current preference for this session. */ }
    render();
    root.querySelector(`[data-language="${language}"]`).focus({ preventScroll: true });
    restoreScroll(scroll);
    return;
  }

  if (event.target.closest('[data-map-toggle]')) {
    toggleExpanded(!entry.expanded);
    return;
  }

  if (event.target.closest('[data-map-reset]')) {
    resetSelection();
    return;
  }

  const astro = event.target.closest('[data-astro-id]');
  if (astro) {
    selectAstro(astro.dataset.astroId, { moveFocus: event.detail === 0, reveal: event.detail === 0 });
    saveEntry();
    return;
  }

  const link = event.target.closest('a[data-route]');
  if (link) navigate(event, link);
});

window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (entry.expanded) toggleExpanded(false);
  else if (entry.selected) resetSelection();
});

window.addEventListener('resize', () => {
  cancelFlight();
  cancelCamera(root.querySelector('.galaxy-scene'));
});

window.addEventListener('popstate', (event) => {
  positions.set(entry.portfolioEntry, mapScroll());
  entry = event.state?.portfolioEntry ? { ...event.state } : newEntry();
  saveEntry();
  render();
  scrollToView(positions.get(entry.portfolioEntry));
});
