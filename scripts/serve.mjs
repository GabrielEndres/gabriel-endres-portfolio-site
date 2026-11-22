import { spawnSync } from 'node:child_process';
import { createReadStream, statSync, watch } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { base, previewOutput as output, repo } from './site-paths.mjs';

const port = Number(process.env.PORT ?? (base === '/' ? 4173 : 4174));
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.vtt': 'text/vtt; charset=utf-8',
};

function rebuild() {
  const result = spawnSync(process.execPath, [path.join(repo, 'scripts', 'build.mjs'), '--preview'], { stdio: 'inherit' });
  return result.status === 0;
}

if (!rebuild()) process.exit(1);

function sendFile(file, response, request, status) {
  const size = statSync(file).size;
  const headers = {
    'Content-Type': types[path.extname(file)] ?? 'application/octet-stream',
    'Content-Length': size,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Accept-Ranges': 'bytes',
    'X-Robots-Tag': 'noindex, nofollow',
  };
  const range = status === 200 && request.headers.range ? /^bytes=(\d*)-(\d*)$/.exec(request.headers.range) : null;
  let slice;
  if (range && (range[1] || range[2])) {
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(size - 1, Number(range[2])) : size - 1;
    if (start > end) {
      response.writeHead(416, { 'Content-Range': `bytes */${size}` }).end();
      return;
    }
    slice = { start, end };
    status = 206;
    headers['Content-Length'] = end - start + 1;
    headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
  }
  response.writeHead(status, headers);
  if (request.method === 'HEAD') response.end();
  else createReadStream(file, slice).on('error', () => response.destroy()).pipe(response);
}

const server = createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  try {
    const { pathname, search } = new URL(request.url, 'http://localhost');
    if (pathname === base.slice(0, -1)) {
      response.writeHead(308, { Location: `${base}${search}` }).end();
      return;
    }
    if (!pathname.startsWith(base)) {
      sendFile(path.join(output, '404.html'), response, request, 404);
      return;
    }
    const file = path.resolve(output, `./${decodeURIComponent(pathname.slice(base.length))}`);
    const relative = path.relative(output, file);
    if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
      response.writeHead(403).end();
      return;
    }

    const entry = statSync(file, { throwIfNoEntry: false });
    if (entry?.isDirectory() && !pathname.endsWith('/')) {
      response.writeHead(308, { Location: `${pathname}/${search}` }).end();
    } else if (entry?.isDirectory()) {
      sendFile(path.join(file, 'index.html'), response, request, 200);
    } else if (entry?.isFile()) {
      sendFile(file, response, request, 200);
    } else {
      sendFile(path.join(output, '404.html'), response, request, 404);
    }
  } catch (error) {
    if (!response.headersSent) response.writeHead(error instanceof URIError ? 400 : 404);
    response.end();
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Local preview: http://127.0.0.1:${server.address().port}${base}`);
});

let timer;
for (const folder of ['src', 'public']) {
  watch(path.join(repo, folder), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });
}
