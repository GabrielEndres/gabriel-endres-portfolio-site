import { categories, projects } from '../content/projects.mjs';

export function galaxyPath(id) {
  return `galaxias/${id}/`;
}

export function projectPath(id) {
  return `projetos/${id}/`;
}

export function resolveRoute(pathname, base) {
  if (!pathname.startsWith(base)) return { type: 'notFound' };
  const path = pathname.slice(base.length).replace(/(?:^|\/)index\.html$/, '').replace(/\/+$/, '');
  if (!path) return { type: 'home' };
  if (path === 'perfil') return { type: 'profile' };

  const [section, id, extra] = path.split('/');
  if (!extra && section === 'galaxias') {
    const category = categories.find((entry) => entry.id === id);
    if (category) return { type: 'galaxy', category };
  }
  if (!extra && section === 'projetos') {
    const project = projects.find((entry) => entry.id === id);
    if (project) {
      const category = categories.find((entry) => entry.id === project.category);
      return { type: 'project', project, category };
    }
  }
  return { type: 'notFound' };
}
