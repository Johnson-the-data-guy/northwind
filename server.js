import { readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT) || 3000;
const RELEASE = process.env.RELEASE || 'dev';
const ROOT = import.meta.dirname;

// Read once at startup; a content change needs a restart.
const projects = JSON.parse(readFileSync(path.join(ROOT, 'content/projects.json'), 'utf8'));

function logRequests(req, res, next) {
  const start = process.hrtime.bigint();
  // 'close' also fires for clients that disconnect before the response ends.
  res.once('close', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`);
  });
  next();
}

function setStaticHeaders(res, filePath, distDir) {
  const relative = path.relative(distDir, filePath);
  if (relative === 'index.html') {
    res.setHeader('Cache-Control', 'no-cache');
  } else if (relative.startsWith(`assets${path.sep}`)) {
    // Vite puts a content hash in every filename under assets/.
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    // public/ files such as covers keep their names, so they stay short-lived.
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
}

export function createApp({ distDir = path.join(ROOT, 'dist') } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(logRequests);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', release: RELEASE });
  });

  app.get('/api/projects', (req, res) => {
    res.json(projects);
  });

  app.get('/api/projects/:slug', (req, res) => {
    const project = projects.find((p) => p.slug === req.params.slug);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  });

  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use(express.static(distDir, {
    index: false,
    setHeaders: (res, filePath) => setStaticHeaders(res, filePath, distDir),
  }));

  app.get('*', (req, res, next) => {
    res.sendFile('index.html', {
      root: distDir,
      cacheControl: false,
      headers: { 'Cache-Control': 'no-cache' },
    }, next);
  });

  // Covers malformed URLs too, which Express rejects before any route runs.
  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    const status = err.status || 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ error: status >= 500 ? 'Internal server error' : 'Bad request' });
  });

  return app;
}

// realpath: argv[1] may be a symlink, while import.meta.url is always resolved.
const isMain = process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  createApp().listen(PORT, HOST, () => {
    console.log(`northwind ${RELEASE} listening on http://${HOST}:${PORT}`);
  });
}
