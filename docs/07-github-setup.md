# GitHub Repository Setup

## Overview

This document covers creating the `web-tools` repository on GitHub, setting up the local Git config, and performing the initial push. Deployment automation is covered separately in [08-deployment.md](./08-deployment.md).

---

## Repository Details

| Setting           | Value                                         |
|-------------------|-----------------------------------------------|
| Owner             | SeeSmitty                                     |
| Repository name   | `web-tools`                                   |
| Visibility        | Public (required for free GitHub Pages)       |
| Default branch    | `main`                                        |
| Deployment branch | `gh-pages` (managed by GitHub Actions)        |
| Live URL          | `https://SeeSmitty.github.io/web-tools/`      |

---

## Step 1 — Create the repository on GitHub

### Option A: GitHub CLI (recommended)

```bash
gh repo create SeeSmitty/web-tools --public --description "Client-side web utility tools" --source=. --remote=origin --push
```

This creates the remote repo, sets it as `origin`, and pushes the current branch in one command.

### Option B: GitHub web UI

1. Go to [https://github.com/new](https://github.com/new)
2. Set repository name to `web-tools`
3. Set visibility to **Public**
4. Do **not** initialize with a README, .gitignore, or license (the local project already has these)
5. Click **Create repository**
6. Follow the "push an existing repository" instructions shown on the next screen

---

## Step 2 — Initialize Git locally (if not already done)

From inside the `web-tools/` project directory:

```bash
git init
git add .
git commit -m "Initial commit"
```

---

## Step 3 — Connect to the remote and push

```bash
git remote add origin https://github.com/SeeSmitty/web-tools.git
git branch -M main
git push -u origin main
```

---

## Step 4 — Verify the repository

After pushing, confirm at `https://github.com/SeeSmitty/web-tools`:

- [ ] All source files are present
- [ ] The `main` branch is the default branch
- [ ] `docs/` folder is visible
- [ ] `.github/` folder is visible (including `copilot-instructions.md` and `workflows/deploy.yml`)

---

## Step 5 — Enable GitHub Pages

GitHub Pages will be configured to deploy from the `gh-pages` branch, which is managed automatically by the GitHub Actions workflow.

1. Go to the repository on GitHub
2. Click **Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Set the branch to `gh-pages` and the folder to `/ (root)`
5. Click **Save**

> The `gh-pages` branch is created automatically on the first successful workflow run. If it doesn't exist yet, GitHub Pages will show an error — this resolves itself after the first push to `main` triggers the workflow.

---

## Branch Strategy

| Branch     | Purpose                                              |
|------------|------------------------------------------------------|
| `main`     | Active development; triggers deployment on push      |
| `gh-pages` | Auto-generated production build; do not edit manually |

No feature branches are required unless the project grows significantly. Direct commits to `main` are fine for a solo project of this scale.

---

## `.gitignore`

Vite generates a `.gitignore` that excludes `node_modules/` and `dist/` by default. Verify these are present:

```
node_modules/
dist/
.DS_Store
```

The `dist/` folder is never committed — it is built and deployed by the GitHub Actions workflow.

---

## Next Step

Proceed to [08-deployment.md](./08-deployment.md) to set up the GitHub Actions workflow.
