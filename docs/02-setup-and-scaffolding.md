# Setup and Scaffolding

## Prerequisites

Ensure the following are installed before starting:

- **Node.js** v18 or later — `node -v`
- **npm** v9 or later — `npm -v`
- **Git** — `git --version`
- **GitHub CLI** (optional, for repo creation from terminal) — `gh --version`

---

## Step 1 — Scaffold the Vite + Vue project

Run this from the `RandomServices` workspace root:

```bash
npm create vite@latest web-tools -- --template vue
cd web-tools
```

This creates the `web-tools/` directory with the Vite + Vue 3 starter template.

---

## Step 2 — Install core dependencies

```bash
npm install
npm install vue-router@4
npm install qrcode
```

### Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

The `-p` flag generates `postcss.config.js` alongside `tailwind.config.js`.

---

## Step 3 — Configure Tailwind

Open `tailwind.config.js` and set the `content` array so Tailwind can tree-shake unused styles:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add Tailwind directives to the global stylesheet. Replace the contents of `src/style.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Ensure `src/main.js` imports this file:

```js
import './style.css'
```

---

## Step 4 — Configure Vite for GitHub Pages

Because the site is hosted at `https://SeeSmitty.github.io/web-tools/` (a sub-path, not the root), Vite must be told the base path so asset URLs resolve correctly.

Open `vite.config.js` and update it:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/web-tools/',
})
```

> **Important:** If this is ever moved to a custom domain at the root, change `base` to `'/'`.

---

## Step 5 — Clean up the starter template

Vite's default template includes placeholder content. Remove it:

1. Delete `src/components/HelloWorld.vue`
2. Delete `src/assets/vue.svg`
3. Clear `src/App.vue` — replace with the shell from [04-ui-components.md](./04-ui-components.md)
4. Clear `src/main.js` — replace with the entry point from [04-ui-components.md](./04-ui-components.md)

---

## Step 6 — Verify the dev server starts

```bash
npm run dev
```

The terminal should print a local URL (default: `http://localhost:5173/web-tools/`). The page will be blank at this point — that's expected until the router and views are wired up.

---

## Step 7 — Verify the production build

```bash
npm run build
npm run preview
```

`npm run build` outputs to `dist/`. `npm run preview` serves that folder locally for final checks before deploying.

---

## Script Reference

| Command           | What it does                                      |
|-------------------|---------------------------------------------------|
| `npm run dev`     | Start local dev server with hot module reload     |
| `npm run build`   | Compile and bundle to `dist/`                     |
| `npm run preview` | Serve `dist/` locally to test the production build |

---

## Next Step

Proceed to [03-routing.md](./03-routing.md) to set up Vue Router.
