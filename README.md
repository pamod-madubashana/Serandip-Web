# Serandip Web

Frontend application for the Serandip project.

## Stack

- React 18
- Vite 5
- TypeScript
- Tailwind CSS
- Vitest

## Getting started

```bash
npm install
npm run dev
```

The dev server starts with Vite's default local URL output.

## Scripts

- `npm run dev` - start the local dev server
- `npm run build` - build the production bundle
- `npm run build:dev` - build using development mode
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint
- `npm run test` - run Vitest once
- `npm run test:watch` - run Vitest in watch mode

## Repository layout

- `src/` - app source code
- `public/` - static assets copied by Vite
- `dist/` - generated build output

## Working from the main repo

This app is also used as the `src/App` submodule inside `Serandip-prime`.

If you cloned the main repository, initialize the frontend with:

```bash
git submodule update --init --recursive
```
