export const PLANET_MODELS = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

export const celestialModels = {
  mercury: { kind: 'planet', label: { pt: 'Mercúrio', en: 'Mercury' } },
  venus: { kind: 'planet', label: { pt: 'Vénus', en: 'Venus' } },
  earth: { kind: 'planet', label: { pt: 'Terra', en: 'Earth' } },
  mars: { kind: 'planet', label: { pt: 'Marte', en: 'Mars' } },
  jupiter: { kind: 'planet', label: { pt: 'Júpiter', en: 'Jupiter' } },
  saturn: { kind: 'planet', label: { pt: 'Saturno', en: 'Saturn' } },
  uranus: { kind: 'planet', label: { pt: 'Urano', en: 'Uranus' } },
  neptune: { kind: 'planet', label: { pt: 'Neptuno', en: 'Neptune' } },
  'red-dwarf': { kind: 'star', label: { pt: 'Anã vermelha', en: 'Red dwarf' } },
  sun: { kind: 'star', label: { pt: 'Estrela semelhante ao Sol', en: 'Sun-like star' } },
  'blue-giant': { kind: 'star', label: { pt: 'Gigante azul', en: 'Blue giant' } },
  'neutron-star': { kind: 'star', label: { pt: 'Estrela de neutrões', en: 'Neutron star' } },
  'black-hole': { kind: 'black-hole', label: { pt: 'Buraco negro', en: 'Black hole' } },
  'white-hole': { kind: 'white-hole', label: { pt: 'Buraco branco', en: 'White hole' } },
  quasar: { kind: 'quasar', label: { pt: 'Quasar', en: 'Quasar' } },
};

export function renderAstro(model, { detail = false } = {}) {
  const id = Object.hasOwn(celestialModels, model) ? model : 'earth';
  const { kind } = celestialModels[id];
  const classes = ['astro', `astro--${kind}`];
  if (id !== kind) classes.push(`astro--${id}`);
  if (detail) classes.push('astro--detail');
  return `<span class="${classes.join(' ')}" aria-hidden="true">
    <span class="astro__halo"></span><span class="astro__disc"></span><span class="astro__accent"></span>
  </span>`;
}
