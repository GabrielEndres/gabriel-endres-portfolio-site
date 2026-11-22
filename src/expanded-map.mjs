export function createExpandedMap(root, onNativeExit) {
  const html = document.documentElement;
  let active = false;
  let native = document.fullscreenElement === root;
  let exiting = false;

  function exitNative() {
    if (document.fullscreenElement !== root || exiting) return;
    exiting = true;
    document.exitFullscreen().catch(() => { exiting = false; });
  }

  document.addEventListener('fullscreenchange', () => {
    const wasNative = native;
    native = document.fullscreenElement === root;
    if (native && !active) exitNative();
    if (wasNative && !native && active && !exiting) onNativeExit();
    if (!native) exiting = false;
  });

  return function setExpanded(value, { requestNative = false } = {}) {
    active = value;
    html.classList.toggle('map-expanded', active);
    root.querySelector('[data-map-toggle]')?.setAttribute('aria-pressed', String(active));
    if (!active) exitNative();
    else if (requestNative && document.fullscreenEnabled && root.requestFullscreen && !native) {
      // Fullscreen can require a trusted gesture. The window-filling layout is already active.
      root.requestFullscreen().catch(() => {});
    }
  };
}
