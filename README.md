# Northwind Design Studio

The website for Northwind Design Studio, a fictional creative agency. Every client, person and
project on it is invented.

A Vite, React and TypeScript front end, served with its JSON API by a single Express process.

## Run it

Requires Node 22 (`nvm use` reads `.nvmrc`).

```sh
npm ci
npm run build
npm start
```

The site is then at <http://127.0.0.1:3000>.

| Variable  | Default | Purpose                                 |
| --------- | ------- | --------------------------------------- |
| `PORT`    | `3000`  | Port to listen on (always on 127.0.0.1) |
| `RELEASE` | `dev`   | Release name reported by `/health`      |

## Develop

```sh
npm run dev    # API on :3000 with restart on change, Vite on :5173 with hot reload
npm run lint
npm test       # needs no build
```

## Layout

- `server.js`: the API, static files and the fallback to `index.html`
- `content/projects.json`: project data, read once at startup, so restart after editing
- `public/covers/`: the cover SVGs the API still returns
- `public/images/`: photos as local WebP files, credited in `CREDITS.md`
- `public/logos/`: brand logos as local SVGs, credited in `CREDITS.md`
- `public/spiral.svg`: the repeating background coil, original artwork for this project
- `src/`: the React app, with one file per route in `src/pages/`
- `src/lib/case-studies.ts`: case-study copy and photos per project, kept out of the API on purpose
- `src/lib/motion.ts`: GSAP, ScrollTrigger and Lenis setup, all off under reduced motion
- `DESIGN.md`: the design direction and tokens

## What was built

Pages: home, filterable work grid, project detail, studio, contact and a designed not-found view, in
dark (default) and light themes, mobile first. The API serves `/health`, `/api/projects` and
`/api/projects/:slug`. Tests cover the server with `node:test` and supertest.
