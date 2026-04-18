# Project Structure

## Directory Layout

```
web-tools/
├── .github/
│   ├── copilot-instructions.md      ← Copilot context file for this project
│   └── workflows/
│       └── deploy.yml               ← GitHub Actions: build + deploy to GitHub Pages
│
├── docs/                            ← Build plan documentation (this folder)
│   ├── 00-overview.md
│   ├── 01-project-structure.md
│   ├── 02-setup-and-scaffolding.md
│   ├── 03-routing.md
│   ├── 04-ui-components.md
│   ├── 05-qr-code-tool.md
│   ├── 06-adding-new-tools.md
│   ├── 07-github-setup.md
│   └── 08-deployment.md
│
├── public/
│   └── favicon.ico                  ← Static assets served as-is by Vite
│
├── src/
│   ├── main.js                      ← App entry point: mounts Vue, registers router
│   ├── App.vue                      ← Root component: navbar + <RouterView>
│   │
│   ├── router/
│   │   └── index.js                 ← All route definitions
│   │
│   ├── views/                       ← One file per page/route
│   │   ├── HomeView.vue             ← Landing page: tool card grid
│   │   └── QRCodeView.vue           ← QR Code tool page
│   │
│   └── components/
│       ├── ToolCard.vue             ← Reusable card component for the landing grid
│       └── tools/
│           └── QRCodeTool.vue       ← The QR generator widget (inputs + canvas + download)
│
├── index.html                       ← Vite HTML entry point
├── vite.config.js                   ← Vite config (base path, Vue plugin)
├── tailwind.config.js               ← Tailwind config
├── postcss.config.js                ← PostCSS config (required by Tailwind)
└── package.json
```

## File Responsibilities

### Root config files

| File                | Responsibility |
|---------------------|----------------|
| `index.html`        | HTML shell; Vite injects the compiled bundle here |
| `vite.config.js`    | Sets `base: '/web-tools/'` for GitHub Pages sub-path hosting; registers `@vitejs/plugin-vue` |
| `tailwind.config.js`| Content paths for Tailwind tree-shaking |
| `postcss.config.js` | Wires Tailwind and Autoprefixer into the CSS pipeline |
| `package.json`      | Dependencies, scripts (`dev`, `build`, `preview`) |

### `src/` files

| File                          | Responsibility |
|-------------------------------|----------------|
| `main.js`                     | Creates the Vue app instance, installs the router, mounts to `#app` |
| `App.vue`                     | Global layout shell — navbar at the top, `<RouterView>` below |
| `router/index.js`             | Defines all routes; maps URL paths to view components |
| `views/HomeView.vue`          | Renders the tool registry as a card grid |
| `views/QRCodeView.vue`        | Page wrapper for the QR tool; imports `QRCodeTool.vue` |
| `components/ToolCard.vue`     | Receives `name`, `description`, `icon`, `route` props; renders a clickable card |
| `components/tools/QRCodeTool.vue` | Self-contained QR generator: input → canvas render → download button |

### `.github/` files

| File                              | Responsibility |
|-----------------------------------|----------------|
| `copilot-instructions.md`         | Keeps GitHub Copilot context-aware of this project's conventions |
| `workflows/deploy.yml`            | CI/CD: on push to `main`, build the app and push `dist/` to `gh-pages` branch |

## Naming Conventions

- **Views** (pages tied to a route): `PascalCase` + `View` suffix — `HomeView.vue`, `QRCodeView.vue`
- **Components** (reusable UI): `PascalCase` — `ToolCard.vue`, `QRCodeTool.vue`
- **Tool components** live under `components/tools/` to keep them separate from layout components
- **Routes** use kebab-case paths: `/qr`, `/image-converter`

## Adding a New Tool — File Checklist

When adding a new tool, the following files are created or modified:

| Action   | File                                         |
|----------|----------------------------------------------|
| Create   | `src/components/tools/NewToolName.vue`       |
| Create   | `src/views/NewToolNameView.vue`              |
| Modify   | `src/router/index.js` — add one route object |
| Modify   | `src/views/HomeView.vue` — add one card entry |

See [06-adding-new-tools.md](./06-adding-new-tools.md) for the full pattern.
