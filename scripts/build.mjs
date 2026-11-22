import { copyFile, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { categories, projects } from '../src/content/projects.mjs';
import { fullName, profile } from '../src/content/profile.mjs';
import { galaxyPath, projectPath, resolveRoute } from '../src/navigation/routes.mjs';
import { escapeHtml, pageTitle, renderSite } from '../src/ui/views.mjs';

const repo = fileURLToPath(new URL('../', import.meta.url));
const preview = process.argv.includes('--preview');
const output = path.join(repo, preview ? '.preview/site' : 'dist');
const edition = preview ? '' : (process.env.PORTFOLIO_BASE ?? '').replace(/^\/+|\/+$/g, '');
if (!/^(?:[\w-]+(?:\/[\w-]+)*)?$/.test(edition)) throw new Error('Invalid PORTFOLIO_BASE.');
const base = edition ? `/${edition}/` : '/';
const cvSource = path.join(repo, preview ? '.preview/cv.pdf' : 'public/media/cv.pdf');
const cv = existsSync(cvSource);

const slugs = new Set();
for (const project of projects) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id) || slugs.has(project.id)) {
    throw new Error(`Invalid or duplicate project identifier: ${project.id}`);
  }
  if (!categories.some((category) => category.id === project.category)) {
    throw new Error(`Unknown category for ${project.id}: ${project.category}`);
  }
  slugs.add(project.id);
}

function page(route) {
  const title = escapeHtml(pageTitle(route, 'pt'));
  const summary = escapeHtml(route.project?.summary.pt ?? profile.pt.intro);
  return `<!doctype html>
<html lang="pt-PT">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#080b14">
  <meta name="description" content="${summary}">
  ${preview ? '<meta name="robots" content="noindex, nofollow">' : ''}
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${summary}">
  <meta property="og:site_name" content="${escapeHtml(fullName)}">
  <title>${title}</title>
  <link rel="icon" href="${base}media/space/planet.webp" type="image/webp">
  <link rel="stylesheet" href="${base}assets/styles.css">
  <link rel="stylesheet" href="${base}assets/celestial.css">
  <link rel="stylesheet" href="${base}assets/map.css">
  <link rel="stylesheet" href="${base}assets/expanded-map.css">
  <script type="module" src="${base}assets/app.mjs"></script>
</head>
<body>
  <div id="site" data-base="${base}" data-cv="${cv}">${renderSite(route, 'pt', { base, cv })}</div>
</body>
</html>`;
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all([
  cp(path.join(repo, 'src'), path.join(output, 'assets'), { recursive: true }),
  cp(path.join(repo, 'public'), output, { recursive: true }),
]);
if (preview && cv) await copyFile(cvSource, path.join(output, 'media/cv.pdf'));

const routes = ['', 'perfil/', ...categories.map(({ id }) => galaxyPath(id)), ...projects.map(({ id }) => projectPath(id))];
await Promise.all(routes.map(async (route) => {
  const directory = path.join(output, route);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), page(resolveRoute(`${base}${route}`, base)));
}));
await writeFile(path.join(output, '404.html'), page({ type: 'notFound' }));
console.log(`Generated ${routes.length} pages in ${path.relative(repo, output)}.`);
