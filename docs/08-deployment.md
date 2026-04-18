# Deployment

## Overview

The app is deployed as a static site to **GitHub Pages** using a **GitHub Actions** workflow. On every push to the `main` branch, the workflow:

1. Checks out the repository
2. Installs Node.js dependencies
3. Runs the Vite production build (`npm run build`)
4. Pushes the contents of `dist/` to the `gh-pages` branch

GitHub Pages serves the `gh-pages` branch automatically.

---

## Live URL

```
https://SeeSmitty.github.io/web-tools/
```

---

## File: `.github/workflows/deploy.yml`

Create this file in the repository. It runs automatically on every push to `main`.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
          clean: true
```

### Workflow notes

| Setting                        | Value / Reason                                                             |
|-------------------------------|----------------------------------------------------------------------------|
| `on: push: branches: [main]`  | Triggers only on pushes to `main` — not on PRs or other branches           |
| `permissions: contents: write`| Required for the deploy action to push to the `gh-pages` branch           |
| `actions/checkout@v4`         | Checks out the repo at the pushed commit                                   |
| `actions/setup-node@v4`       | Installs Node 20 LTS with npm caching to speed up subsequent runs         |
| `npm ci`                      | Installs exact versions from `package-lock.json` (more reliable than `npm install` in CI) |
| `npm run build`               | Runs `vite build`, outputs to `dist/`                                      |
| `JamesIves/github-pages-deploy-action@v4` | Pushes `dist/` to `gh-pages` branch; `clean: true` removes stale files |

---

## Workflow Status

After pushing to `main`, check the workflow status at:

```
https://github.com/SeeSmitty/web-tools/actions
```

A green checkmark means the deployment succeeded. The live URL should reflect changes within ~1 minute of the workflow completing.

---

## Manual Deployment (fallback)

If you need to deploy manually without GitHub Actions:

```bash
npm run build
npx gh-pages -d dist
```

This requires the `gh-pages` npm package:

```bash
npm install -D gh-pages
```

Or use the GitHub CLI:

```bash
npm run build
git subtree push --prefix dist origin gh-pages
```

---

## Vite Base Path Requirement

Because the site is hosted at a sub-path (`/web-tools/`), `vite.config.js` must have:

```js
base: '/web-tools/',
```

Without this, all asset paths in the production build will be wrong and the site will appear blank. See [02-setup-and-scaffolding.md](./02-setup-and-scaffolding.md) for the full Vite config.

---

## Vue Router and Hash Mode

The router uses **hash mode** (`createWebHashHistory`), which means all navigation happens after the `#` in the URL:

```
https://SeeSmitty.github.io/web-tools/#/qr
```

This is required for GitHub Pages compatibility. If history mode were used, a direct visit to `/web-tools/qr` would return a 404 because GitHub Pages only serves `index.html` from the root — it does not redirect unknown paths. Hash mode routes never hit the server.

---

## Deployment Checklist

Before merging / pushing to `main`:

- [ ] `npm run build` completes without errors locally
- [ ] `npm run preview` shows the correct UI at `http://localhost:4173/web-tools/`
- [ ] All tool routes navigate correctly in the preview
- [ ] `vite.config.js` has `base: '/web-tools/'`
- [ ] `.github/workflows/deploy.yml` is committed

After pushing:

- [ ] GitHub Actions workflow run is visible at `/actions`
- [ ] Workflow completes with a green checkmark
- [ ] `gh-pages` branch exists and contains the `dist/` contents
- [ ] Live URL loads correctly: `https://SeeSmitty.github.io/web-tools/`
