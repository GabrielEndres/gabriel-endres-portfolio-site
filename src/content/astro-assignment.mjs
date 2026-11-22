import { PLANET_MODELS, celestialModels } from './celestial.mjs';

export function assignProjectAstros(projects) {
  const slots = new Set();
  for (const { id, astro, planetSlot } of projects) {
    if (astro != null && !Object.hasOwn(celestialModels, astro)) {
      throw new Error(`Unknown celestial model for ${id}: ${astro}`);
    }
    if (planetSlot == null) continue;
    if (astro != null || !Number.isSafeInteger(planetSlot) || planetSlot < 0 || slots.has(planetSlot)) {
      throw new Error(`Invalid or duplicate planet slot for ${id}: ${planetSlot}`);
    }
    slots.add(planetSlot);
  }

  let nextSlot = 0;
  return new Map(projects.map(({ id, astro, planetSlot }) => {
    if (astro != null) return [id, astro];
    if (planetSlot != null) return [id, PLANET_MODELS[planetSlot % PLANET_MODELS.length]];
    while (slots.has(nextSlot)) nextSlot++;
    return [id, PLANET_MODELS[nextSlot++ % PLANET_MODELS.length]];
  }));
}

const decorations = {
  academic: { star: 'sun', hole: 'black-hole' },
  web: { star: 'blue-giant', hole: 'white-hole' },
  ai: { star: 'neutron-star', hole: 'black-hole' },
};

export function completeGalaxy(categoryId, entries) {
  const models = decorations[categoryId];
  if (!models) return entries;

  const kinds = new Set(entries.map(({ model }) => celestialModels[model].kind));
  const extra = [];
  if (!kinds.has('star')) extra.push({ id: `${categoryId}:decorative-star`, model: models.star, project: null });
  if (!kinds.has('black-hole') && !kinds.has('white-hole')) {
    extra.push({ id: `${categoryId}:decorative-hole`, model: models.hole, project: null });
  }
  return [...entries, ...extra];
}
