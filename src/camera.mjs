const activeFlights = new WeakMap();

export function cancelCamera(scene) {
  const flight = activeFlights.get(scene);
  if (!flight) return;
  for (const animation of flight.animations) animation.cancel();
  window.clearTimeout(flight.reveal);
  activeFlights.delete(scene);
}

export function focusAstro(scene, button, { animate = true } = {}) {
  cancelCamera(scene);
  if (!button) return;

  const panel = scene.querySelector('[data-astro-focus]');
  const source = button.querySelector('.astro');
  const target = panel?.querySelector('.astro-preview > .astro');
  if (!source || !target) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animations = [];
  if (animate && !reduceMotion && target.animate) {
    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    if (from.width && to.width) {
      const compact = window.matchMedia('(max-width: 700px), (max-height: 580px)').matches;
      const duration = compact ? 420 : 640;
      const x = from.left + from.width / 2 - to.left - to.width / 2;
      const y = from.top + from.height / 2 - to.top - to.height / 2;
      const scale = from.width / to.width;
      animations.push(target.animate([
        { transform: `translate(${x}px, ${y}px) scale(${scale})`, opacity: .42 },
        { transform: `translate(${x * .22}px, ${y * .22}px) scale(${scale + (1 - scale) * .68})`, opacity: 1, offset: .46 },
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      ], { duration, easing: 'cubic-bezier(.18,.72,.24,1)' }));

      const orbits = scene.querySelector('.galaxy-orbits');
      if (orbits) {
        animations.push(orbits.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: .76 },
          { transform: `translate(${-x * .07}px, ${-y * .07}px) scale(1.17)`, opacity: .48, offset: .62 },
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        ], { duration, easing: 'ease-out' }));
      }
    }
  }

  const reveal = animate ? window.setTimeout(() => {
    if (!scene.isConnected || panel.hidden) return;
    const actions = panel.querySelector('.actions');
    const bounds = actions?.getBoundingClientRect() ?? panel.getBoundingClientRect();
    const sceneBounds = scene.getBoundingClientRect();
    const viewportTop = document.querySelector('.topbar')?.getBoundingClientRect().bottom ?? 0;
    if (bounds.top < Math.max(sceneBounds.top, viewportTop) || bounds.bottom > Math.min(sceneBounds.bottom, window.innerHeight)) {
      panel.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'instant' : 'smooth' });
    }
  }, 220) : undefined;
  activeFlights.set(scene, { animations, reveal });
}
