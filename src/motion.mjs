const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const compactScreen = window.matchMedia('(max-width: 700px), (pointer: coarse)');
const limitedDevice = (navigator.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4;

export function drawStars(container) {
  if (!container || !window.ResizeObserver) return () => {};
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return () => {};
  container.append(canvas);

  const observer = new ResizeObserver(([{ contentRect }]) => {
    const { width, height } = contentRect;
    if (!width || !height) return;
    const compact = compactScreen.matches || limitedDevice;
    const ratio = Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    let seed = 14367;
    function random() {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    const total = Math.min(compact ? 180 : 520, Math.round(width * height / 2050));
    for (let index = 0; index < total; index++) {
      const x = random() * width;
      const y = random() * height;
      const radius = .28 + random() ** 3 * 1.12;
      context.fillStyle = `rgba(181, 205, 255, ${.16 + random() * .65})`;
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.fill();

      if (radius > 1.18 && !compact) {
        context.fillStyle = 'rgba(144, 179, 255, .22)';
        context.fillRect(x - 3.5, y - .35, 7, .7);
        context.fillRect(x - .35, y - 3.5, .7, 7);
      }
    }
  });
  observer.observe(container);
  return () => observer.disconnect();
}

export function runGalaxyFlight(source, bounds, destination) {
  const ignore = () => {};
  if (!destination || motionReduced.matches || !source.animate) return ignore;
  const { left, top, width, height } = bounds;
  if (!width || !height) return ignore;

  const image = source.cloneNode();
  image.className = 'flight';
  image.style.inset = `${top}px auto auto ${left}px`;
  image.style.width = `${width}px`;
  image.style.height = `${height}px`;
  image.setAttribute('aria-hidden', 'true');
  const overlay = document.fullscreenElement ?? document.body;
  overlay.append(image);

  const x = window.innerWidth / 2 - left - width / 2;
  const y = window.innerHeight / 2 - top - height / 2;
  const compact = compactScreen.matches || limitedDevice;
  const duration = compact ? 440 : 650;
  const animation = image.animate([
    { transform: 'scale(1)', opacity: .86 },
    { transform: `translate(${x}px, ${y}px) scale(${compact ? 2.3 : 3.8})`, opacity: 0 },
  ], { duration, easing: 'cubic-bezier(.2,.68,.3,1)' });
  const orbits = destination.querySelector('.galaxy-orbits')?.animate(
    [{ opacity: .15 }, { opacity: 1 }], { duration, easing: 'ease-out' },
  );
  animation.finished.then(() => image.remove(), () => image.remove());
  return () => {
    animation.cancel();
    orbits?.cancel();
    image.remove();
  };
}
