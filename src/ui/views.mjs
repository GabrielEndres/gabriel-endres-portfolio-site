import { categories, featuredProjects, galaxyObjects, projectAstro, projectsIn } from '../content/projects.mjs';
import { celestialModels, renderAstro } from '../content/celestial.mjs';
import { fullName, profile } from '../content/profile.mjs';
import { inLanguage, translations } from '../content/translations.mjs';
import { galaxyPath, projectPath } from '../navigation/routes.mjs';

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

export function pageTitle(route, language) {
  const t = translations[language];
  const labels = {
    home: t.portfolio.split(' · ')[0],
    galaxy: route.category?.label[language],
    project: route.project?.title[language],
    profile: t.profile,
    notFound: t.notFound,
  };
  return `${labels[route.type]} · ${fullName}`;
}

export function renderAstroFocus({ model, project }, language, base) {
  const t = translations[language];
  const title = escapeHtml(project.title[language]);
  const href = escapeHtml(base + projectPath(project.id));
  return `<div class="astro-preview">${renderAstro(model, { detail: true })}</div>
    <div class="astro-info">
      <p class="eyebrow">${escapeHtml(celestialModels[model].label[language])}</p>
      <h2 id="astro-focus-title">${title}</h2>
      <p class="astro-summary">${escapeHtml(project.summary[language])}</p>
      <div class="actions">
        <a data-route data-map-project class="button button--primary" href="${href}">${t.viewProject}</a>
        <button type="button" class="button button--quiet" data-map-reset>${t.resetCamera}</button>
      </div>
    </div>`;
}

export function renderSite(route, language, config) {
  const t = translations[language];
  const local = (value) => escapeHtml(inLanguage(value, language));
  const url = (path = '') => escapeHtml(`${config.base}${path}`);
  const space = (file) => url(`media/space/${file}`);
  const plus = '<span class="target" aria-hidden="true">+</span>';
  const mark = '<span class="brand-mark" aria-hidden="true">✦</span>';

  function commitChart({ authored, total }) {
    const ratio = authored / total;
    const percent = new Intl.NumberFormat(language === 'pt' ? 'pt-PT' : 'en-GB', {
      style: 'percent', maximumFractionDigits: 1,
    }).format(ratio);
    return `<section class="commit-chart">
      <h2>${t.commitActivity}</h2>
      <div class="commit-ring" style="--commit-share: ${ratio * 100}%">
        <strong>${percent}</strong>
      </div>
      <dl class="commit-counts">
        <div><dt>${t.authoredCommits}</dt><dd>${authored}</dd></div>
        <div><dt>${t.totalCommits}</dt><dd>${total}</dd></div>
      </dl>
      <p class="commit-method">${t.commitMethod}</p>
    </section>`;
  }

  function external(href, label, className = 'button button--quiet', accessible = `${label} (${t.newTab})`) {
    return `<a class="${className}" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(accessible)}">${escapeHtml(label)}</a>`;
  }

  function cvButton(className) {
    return config.cv ? external(`${config.base}media/cv.pdf`, t.viewCV, className, t.cvLabel) : '';
  }

  function profileLinks() {
    return `<div class="actions profile-links">
      ${cvButton('button button--quiet')}
      ${external(profile.linkedin, 'LinkedIn')}
      ${external(profile.github, 'GitHub')}
    </div>`;
  }

  function status(project) {
    return project.status ? `<span class="status">${t[project.status]}</span>` : '';
  }

  function tagList(items) {
    return `<ul class="tags" role="list">${items.map((item) => `<li>${local(item)}</li>`).join('')}</ul>`;
  }

  function tile(project) {
    return `<li class="project-tile">
      <a data-route href="${url(projectPath(project.id))}" class="tile-link">
        <strong class="tile-title">${local(project.title)}</strong>${status(project)}
        <p>${local(project.summary)}</p>
        <span class="tile-action">${t.viewProject} ${plus}</span>
      </a>
    </li>`;
  }

  function projectIndex() {
    const featured = featuredProjects();
    return `<section id="projetos" class="project-index shell" aria-labelledby="index-title">
      <div class="section-head">
        <h2 id="index-title" tabindex="-1">${t.index}</h2>${profileLinks()}
      </div>
      ${featured.length ? `<section class="featured" aria-labelledby="featured-title"><h3 id="featured-title">${t.featured}</h3>
        <ul class="tile-grid" role="list">${featured.map(tile).join('')}</ul></section>` : ''}
      <div class="index-groups">${categories.map((category) => {
        const entries = projectsIn(category.id);
        return `<section class="index-group theme-${category.id}" aria-labelledby="index-${category.id}">
          <h3 id="index-${category.id}" class="category-heading"><span aria-hidden="true"></span>${local(category.label)}</h3>
          <ul class="tile-grid" role="list">${entries.map(tile).join('')}</ul>
        </section>`;
      }).join('')}</div>
    </section>`;
  }

  function expandMapButton() {
    return `<button type="button" class="button button--quiet map-toggle" data-map-toggle aria-pressed="false">
      <span class="map-expand-label">${t.expandMap}</span>
      <span class="map-exit-label">${t.exitFullScreen}</span>
    </button>`;
  }

  function home() {
    return `<section class="universe shell" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow"><span aria-hidden="true"></span>${t.portfolio}</p>
        <h1 id="page-title" tabindex="-1">${escapeHtml(profile.firstNames)} <span>${escapeHtml(profile.lastName)}</span></h1>
        <p class="hero-role">${profile[language].role}</p>
        <p class="hero-intro">${profile[language].intro}</p>
        <p class="hero-experience">${profile[language].experience.replace(/^Java/, '<strong>Java</strong>')}</p>
        <div class="actions hero-actions"><a data-route class="button button--primary" href="${url('#projetos')}">${t.viewProjects}</a>${cvButton('button button--quiet')}</div>
      </div>
      <section class="universe-map" aria-labelledby="map-title">
        <div class="map-toolbar">
          <div class="map-caption"><h2 id="map-title" tabindex="-1">${t.map}</h2><p>${t.mapHint}</p></div>
          ${expandMapButton()}
        </div>
        <div class="map-stage">
          <div class="map-orbits" aria-hidden="true"><i></i><i></i><i></i></div>
          ${categories.map((category) => {
            const count = projectsIn(category.id).length;
            return `<a data-route data-galaxy="${category.id}" class="galaxy-node theme-${category.id}" href="${url(galaxyPath(category.id))}">
              <img class="galaxy-image" aria-hidden="true" alt="" decoding="async" width="512" height="512" src="${space(category.art)}">
              <span class="node-label"><span><strong>${local(category.label)}</strong><small>${count === 1 ? t.oneProject : t.manyProjects(count)}</small></span>${plus}</span>
            </a>`;
          }).join('')}
          <a data-route href="${url('perfil/')}" class="profile-node">
            <span class="constellation" aria-hidden="true"><i></i><i></i><i></i><b></b><b></b><b></b><b></b></span>
            <span class="node-label"><strong>${t.profile}</strong>${plus}</span>
          </a>
        </div>
      </section>
    </section>${projectIndex()}`;
  }

  function breadcrumbs(category, project) {
    const first = `<a data-route href="${url()}">${t.backUniverse}</a>`;
    const second = project ? `<a data-route data-map-return href="${url(galaxyPath(category.id))}">${t.backToMap}</a>` : '';
    return `<div class="return-links">${first}${second}</div>`;
  }

  function galaxy(category) {
    const entries = projectsIn(category.id);
    return `<div class="shell galaxy-page theme-${category.id}">
      <div class="galaxy-toolbar">
        <div class="page-heading galaxy-heading">
          ${breadcrumbs(category)}
          <h1 id="page-title" tabindex="-1">${local(category.label)}</h1>
          <p>${t.galaxyHint}</p>
        </div>
        ${expandMapButton()}
      </div>
      <div class="galaxy-scene" style="--galaxy-art: url('${space(category.art)}')">
        <div class="galaxy-orbits" aria-hidden="true"><i></i><i></i><i></i></div>
        <ul class="planet-grid" role="list">
          ${galaxyObjects(category.id).map(({ id, model, project }) => {
            const label = local(celestialModels[model].label);
            const astro = renderAstro(model);
            if (!project) return `<li class="decorative-astro"><div class="planet-node">${astro}
              <span class="node-label"><span><strong>${label}</strong><small>${t.decorativeAstro}</small></span></span>
            </div></li>`;
            return `<li><button type="button" data-astro-id="${escapeHtml(id)}" data-astro-model="${escapeHtml(model)}" aria-pressed="false" aria-controls="astro-focus" class="planet-node">
              ${astro}<span class="node-label"><span><strong>${local(project.title)}</strong><small>${label}</small></span>${plus}</span>
            </button></li>`;
          }).join('')}
        </ul>
        <section id="astro-focus" class="astro-focus" data-astro-focus aria-labelledby="astro-focus-title" hidden></section>
      </div>
      <section class="galaxy-index" aria-labelledby="galaxy-index-title"><h2 id="galaxy-index-title">${t.galaxyProjects}</h2>
        <ul class="tile-grid" role="list">${entries.map(tile).join('')}</ul>
      </section>
    </div>`;
  }

  function detailSection(project, key) {
    return project[key]?.[language] ? `<section><h2>${t[key]}</h2><p>${local(project[key])}</p></section>` : '';
  }

  function mediaItems(items) {
    if (!items.length) return '';
    const assetHref = (value) => /^https?:\/\//.test(value) ? value : `${config.base}${value}`;
    const assetUrl = (value) => escapeHtml(assetHref(value));
    return `<section class="case-media"><h2>${t.media}</h2><div class="media-grid">
      ${items.map((item) => {
        const label = local(item.label);
        if (item.type === 'demo') return external(assetHref(item.src), inLanguage(item.label, language));
        const visual = item.type === 'video'
          ? `<video controls preload="metadata" src="${assetUrl(item.src)}" aria-label="${label}"${item.poster ? ` poster="${assetUrl(item.poster)}"` : ''}>
              ${item.captions?.[language] ? `<track kind="captions" src="${assetUrl(item.captions[language])}" srclang="${language}" label="${language.toUpperCase()}" default>` : ''}</video>`
          : `<img src="${assetUrl(item.src)}" alt="${local(item.alt ?? item.label)}" loading="lazy" decoding="async">`;
        return `<figure>${visual}<figcaption>${label}</figcaption></figure>`;
      }).join('')}
    </div></section>`;
  }

  function detail(project, category) {
    return `<article class="shell case-page theme-${category.id}">
      ${breadcrumbs(category, project)}
      <div class="case-hero">
        <div class="page-heading">
          <p class="eyebrow"><span aria-hidden="true"></span>${local(category.label)}</p>
          <h1 id="page-title" tabindex="-1">${local(project.title)}</h1>
          <p>${local(project.summary)}</p>
          <div class="case-meta">${status(project)}${project.team ? `<span>${t.team}</span>` : ''}${project.semester ? `<span>${t.semester(project.semester)}</span>` : ''}</div>
        </div>
        <div class="case-art" aria-hidden="true">${renderAstro(projectAstro(project), { detail: true })}</div>
      </div>
      <div class="case-body">
        <div class="case-story">${['objective', 'built', 'scope', 'contribution', 'results', 'working', 'planned'].map((key) => detailSection(project, key)).join('')}</div>
        <div class="case-aside">
          ${project.commits ? commitChart(project.commits) : ''}
          ${project.technologies.length ? `<section><h2>${t.technologies}</h2>${tagList(project.technologies)}</section>` : ''}
          ${project.skills.length ? `<section><h2>${t.skills}</h2>${tagList(project.skills)}</section>` : ''}
          ${project.commits && !project.repository ? `<p class="private-repository-note">${t.privateAcademicRepo}</p>` : ''}
          ${project.repository ? external(project.repository, t.repository) : ''}
        </div>
      </div>
      ${mediaItems(project.media)}
      <div class="case-contact"><h2>${t.profile}</h2>${profileLinks()}</div>
    </article>`;
  }

  function profilePage() {
    return `<article class="shell profile-page">
      ${breadcrumbs()}
      <div class="page-heading profile-heading">
        <p class="eyebrow"><span aria-hidden="true"></span>${t.profile}</p>
        <h1 id="page-title" tabindex="-1">${escapeHtml(fullName)}</h1>
        <p><strong>${profile[language].role}</strong></p>
        <p>${profile[language].intro} ${profile[language].experience}</p>
        ${profileLinks()}
      </div>
      <div class="profile-details">
        <section><h2>${t.education}</h2><h3>${profile[language].degree}</h3>
          <p>${profile.institution} · ${profile.city}</p><p>${t.graduation(profile.graduation)}</p>
        </section>
        <section><h2>${t.skills}</h2><div class="skill-groups">${profile.skills.map(([key, items]) => `<div><h3>${t[key]}</h3>${tagList(items)}</div>`).join('')}</div></section>
      </div>
    </article>`;
  }

  function missing() {
    return `<div class="shell missing"><div class="page-heading"><h1 id="page-title" tabindex="-1">${t.notFound}</h1><p>${t.notFoundHelp}</p></div>
      <div class="actions"><a data-route class="button button--primary" href="${url()}">${t.backUniverse}</a><a data-route class="button button--quiet" href="${url('#projetos')}">${t.viewProjects}</a></div></div>`;
  }

  const views = {
    home,
    galaxy: () => galaxy(route.category),
    project: () => detail(route.project, route.category),
    profile: profilePage,
    notFound: missing,
  };
  const indexActive = route.type === 'home' && config.hash === '#projetos';
  const currentPage = (active) => active ? ' aria-current="page"' : '';

  return `<a class="skip-link" href="#conteudo">${t.skip}</a>
    <header class="topbar">
      <div class="shell topbar-inner">
        <a class="brand" data-route href="${url()}">${mark}<span>${escapeHtml(fullName)}</span></a>
        <nav class="main-nav" aria-label="${t.primaryNav}">
          <a data-route href="${url()}"${currentPage(route.type === 'home' && !indexActive)}>${t.universe}</a>
          <a data-route href="${url('#projetos')}"${currentPage(indexActive)}>${t.viewProjects}</a>
          <a data-route href="${url('perfil/')}"${currentPage(route.type === 'profile')}>${t.profile}</a>
        </nav>
        <div class="language" role="group" aria-label="${t.language}">
          <button type="button" data-language="pt" lang="pt-PT" aria-label="Português (Portugal)" aria-pressed="${language === 'pt'}">PT</button>
          <button type="button" data-language="en" lang="en" aria-label="English" aria-pressed="${language === 'en'}">EN</button>
        </div>
      </div>
    </header>
    <main id="conteudo" tabindex="-1" data-view="${route.type}">
      <div class="ambience" aria-hidden="true"></div>${views[route.type]()}
    </main>
    <footer class="shell site-footer"><a data-route class="brand" href="${url()}">${mark}<span>${escapeHtml(fullName)}</span></a>${profileLinks()}</footer>`;
}
