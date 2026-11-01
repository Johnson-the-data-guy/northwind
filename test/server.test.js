import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import request from 'supertest';

process.env.RELEASE = 'test-release';
const { createApp } = await import('../server.js');

describe('server', () => {
  let distDir;
  let app;

  // A fixture dist keeps the suite independent of `npm run build`.
  before(() => {
    distDir = mkdtempSync(path.join(tmpdir(), 'northwind-dist-'));
    mkdirSync(path.join(distDir, 'assets'));
    writeFileSync(path.join(distDir, 'index.html'), '<!doctype html><title>Northwind</title>');
    writeFileSync(path.join(distDir, 'assets', 'app-abc123.js'), 'console.log("hi");');
    writeFileSync(path.join(distDir, 'favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
    app = createApp({ distDir });
  });

  after(() => rmSync(distDir, { recursive: true, force: true }));

  it('GET /health returns 200 and the release', async () => {
    const res = await request(app).get('/health').expect(200);
    assert.deepEqual(res.body, { status: 'ok', release: 'test-release' });
  });

  it('GET /api/projects returns 6 projects', async () => {
    const res = await request(app).get('/api/projects').expect(200);
    assert.equal(res.body.length, 6);
  });

  it('GET /api/projects/:slug returns one project', async () => {
    const { body: [first] } = await request(app).get('/api/projects');
    const res = await request(app).get(`/api/projects/${first.slug}`).expect(200);
    assert.deepEqual(res.body, first);
  });

  it('unknown slug returns 404 JSON', async () => {
    const res = await request(app).get('/api/projects/no-such-project').expect(404);
    assert.match(res.headers['content-type'], /json/);
  });

  it('/api/nope returns 404 JSON', async () => {
    const res = await request(app).get('/api/nope').expect(404);
    assert.match(res.headers['content-type'], /json/);
  });

  it('other methods on /api paths return 404 JSON', async () => {
    const res = await request(app).post('/api/projects').expect(404);
    assert.match(res.headers['content-type'], /json/);
  });

  it('a malformed /api URL returns 400 JSON', async () => {
    const res = await request(app).get('/api/projects/%E0%A4%A').expect(400);
    assert.match(res.headers['content-type'], /json/);
  });

  it('/work returns index.html with 200 and no-cache', async () => {
    const res = await request(app).get('/work').expect(200);
    assert.match(res.headers['content-type'], /html/);
    assert.match(res.text, /<title>Northwind<\/title>/);
    assert.equal(res.headers['cache-control'], 'no-cache');
  });

  it('/ and /index.html are served no-cache', async () => {
    const root = await request(app).get('/').expect(200);
    assert.equal(root.headers['cache-control'], 'no-cache');
    const file = await request(app).get('/index.html').expect(200);
    assert.equal(file.headers['cache-control'], 'no-cache');
  });

  it('hashed assets get a long cache, other static files a short one', async () => {
    const hashed = await request(app).get('/assets/app-abc123.js').expect(200);
    assert.equal(hashed.headers['cache-control'], 'public, max-age=31536000, immutable');
    const plain = await request(app).get('/favicon.svg').expect(200);
    assert.equal(plain.headers['cache-control'], 'public, max-age=3600');
  });
});
