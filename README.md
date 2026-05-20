# excel-front-fresh

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Environment Variables

This project uses Vite environment variables. Create a `.env` file in the root directory with the following variables:

```env
VITE_FRONTEND_PORT=5195
VITE_API_URL=http://localhost:8000/api
```

**Important Notes:**

- All environment variables must be prefixed with `VITE_` to be accessible in the frontend
- Variables are embedded during build time, not runtime
- For production deployment, ensure the `.env` file is present in `/opt/front/` directory

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
bun install
```

### Compile and Hot-Reload for Development

```sh
bun --bun run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
bun --bun run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun --bun run lint
```
