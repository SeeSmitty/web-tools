# Web Tools — Project Overview

## Purpose

A client-side web application that provides a growing collection of simple, useful conversion and utility tools. Built to be fast, dependency-light, and freely hostable as a static site on GitHub Pages.

## Live URL

```
https://SeeSmitty.github.io/web-tools/
```

## Tech Stack

| Layer         | Choice                   | Reason                                              |
|---------------|--------------------------|-----------------------------------------------------|
| Framework     | Vue 3 (Composition API)  | Lightweight, clean Single File Components           |
| Build tool    | Vite                     | Fast dev server, zero-config Vue support            |
| Routing       | Vue Router 4             | SPA navigation between tool pages                   |
| Styling       | Tailwind CSS             | Utility-first, no custom CSS sprawl                 |
| QR generation | `qrcode` (npm)           | Client-side canvas rendering, no backend needed     |
| Hosting       | GitHub Pages             | Free static hosting via `gh-pages` branch           |
| CI/CD         | GitHub Actions           | Auto-deploy on every push to `main`                 |

## Guiding Principles

- **Client-side only.** All tools run entirely in the browser. No server, no API keys, no backend.
- **Static hosting.** The production build is a plain `dist/` folder deployable anywhere.
- **Extensible by design.** Adding a new tool requires only three changes — a component, a route, and a landing card entry. Nothing else in the app changes.
- **Consistent documentation.** Every build step references a corresponding doc in this `/docs` folder.

## Current Tools

| Tool              | Route  | Status      |
|-------------------|--------|-------------|
| QR Code Generator | `/qr`  | Planned     |

## Planned Future Tools

New tools can be added following the pattern in [06-adding-new-tools.md](./06-adding-new-tools.md).

## Document Index

| File                                                        | Contents                                 |
|-------------------------------------------------------------|------------------------------------------|
| [00-overview.md](./00-overview.md)                          | This file — project goals and tech stack |
| [01-project-structure.md](./01-project-structure.md)        | Directory layout and file responsibilities |
| [02-setup-and-scaffolding.md](./02-setup-and-scaffolding.md)| Initial project scaffolding commands    |
| [03-routing.md](./03-routing.md)                            | Vue Router config and route definitions  |
| [04-ui-components.md](./04-ui-components.md)                | Shell, navbar, HomeView, ToolCard        |
| [05-qr-code-tool.md](./05-qr-code-tool.md)                  | QR Code tool implementation              |
| [06-adding-new-tools.md](./06-adding-new-tools.md)          | Pattern for adding future tools          |
| [07-github-setup.md](./07-github-setup.md)                  | Repository creation and initial push     |
| [08-deployment.md](./08-deployment.md)                      | GitHub Pages and GitHub Actions workflow |
