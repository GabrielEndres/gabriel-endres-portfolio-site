import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const repo = fileURLToPath(new URL('../', import.meta.url));
const prefix = (process.env.PORTFOLIO_BASE ?? '').replace(/^\/+|\/+$/g, '');
if (!/^(?:[\w-]+(?:\/[\w-]+)*)?$/.test(prefix)) throw new Error('Invalid PORTFOLIO_BASE.');

export const base = prefix ? `/${prefix}/` : '/';
export const previewOutput = path.join(repo, '.preview', prefix ? `site-${encodeURIComponent(prefix)}` : 'site');
