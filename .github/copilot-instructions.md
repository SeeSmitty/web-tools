# GitHub Copilot Instructions — web-tools

This file provides context to GitHub Copilot about this project's conventions, architecture, and build plan. Reference the `/docs` folder for the full plan.

---

## Project Summary

A client-side Vue 3 + Vite web application that hosts a collection of browser-based utility tools. No backend. Deployed as a static site to GitHub Pages at `https://SeeSmitty.github.io/web-tools/`.

## Tech Stack

- **Vue 3** with Composition API (`<script setup>`)
- **Vite** as build tool; base path is `/web-tools/` for GitHub Pages
- **Vue Router 4** in hash mode (`createWebHashHistory`)
- **Tailwind CSS** for all styling — no custom CSS files
- **`qrcode`** npm package for QR code generation (client-side canvas)

## Architecture Rules

1. **All tools are client-side only.** No fetch calls, no APIs, no backend.
2. **Each tool has exactly two files:** a view wrapper in `src/views/` and a self-contained component in `src/components/tools/`.
3. **The tool registry in `HomeView.vue`** is a plain JS array. Adding a new tool means adding one object to that array, creating two files, and adding one route. Nothing else changes.
4. **Vue Router uses hash mode** — do not switch to history mode; it breaks GitHub Pages.
5. **`vite.config.js` must keep `base: '/web-tools/'`** — removing this breaks all asset paths in production.

## File Naming Conventions

| File type         | Convention              | Example                     |
|-------------------|-------------------------|-----------------------------|
| View (page)       | PascalCase + View       | `QRCodeView.vue`            |
| Tool component    | PascalCase + Tool       | `QRCodeTool.vue`            |
| Shared component  | PascalCase              | `ToolCard.vue`              |
| Route path        | kebab-case              | `/qr`, `/image-converter`   |

## Component Structure

- Tool components: self-contained widgets. All refs, watchers, and logic live inside the component. No emits, no global state.
- View wrappers: thin — only a heading and the tool component import.
- `App.vue`: only the navbar and `<RouterView>`. No tool-specific logic.

## Styling Rules

- All styles via Tailwind utility classes — no `<style>` blocks unless absolutely necessary
- Tool cards use a **colored gradient banner** at top (icon) + white text section below — use `overflow-hidden` on the card wrapper
- Available card `color` values: `blue`, `green`, `purple`, `orange`, `pink`, `teal` — always assign one per tool
- Primary action buttons use: `bg-blue-600 text-white hover:bg-blue-700`
- Max content width: `max-w-5xl mx-auto` (set in `App.vue`, not repeated in views)
- Tool panels: `max-w-lg`
- Hover effects on cards: `hover:shadow-xl hover:-translate-y-1 transition-all duration-200`

## Current Routes

| Path  | View               | Description            |
|-------|--------------------|------------------------|
| `/`   | `HomeView.vue`     | Tool card grid         |
| `/qr` | `QRCodeView.vue`   | QR Code generator      |

## Adding a New Tool — Quick Reference

1. Create `src/components/tools/NewToolName.vue`
2. Create `src/views/NewToolNameView.vue`
3. Add route to `src/router/index.js` (lazy loaded)
4. Add card object to `tools` array in `src/views/HomeView.vue` — include a `color` field (blue, green, purple, orange, pink, teal)

See `docs/06-adding-new-tools.md` for the full pattern.

## Deployment

- GitHub Actions workflow at `.github/workflows/deploy.yml`
- Triggers on push to `main`
- Builds with `npm ci && npm run build`
- Deploys `dist/` to `gh-pages` branch via `JamesIves/github-pages-deploy-action@v4`

## Documentation

All build plan documents are in `/docs/`. Each step of the build has a corresponding doc. When suggesting changes, ensure they are consistent with the conventions in these documents.
