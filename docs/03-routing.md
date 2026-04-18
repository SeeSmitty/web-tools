# Routing

## Overview

Vue Router 4 handles navigation between tool pages. This app uses **hash mode** (`/#/qr`) rather than HTML5 history mode for GitHub Pages compatibility — history mode requires server-side fallback configuration that static hosts do not support.

---

## File: `src/router/index.js`

```js
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/qr',
    name: 'qr-code',
    component: () => import('../views/QRCodeView.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
```

### Key decisions

- **Hash mode** (`createWebHashHistory`): URLs look like `/#/qr`. No 404s on hard refresh — GitHub Pages serves `index.html` for all requests, and the hash portion is handled entirely by the browser.
- **Lazy loading** for tool views (`() => import(...)`): Each tool's code is split into its own chunk and only loaded when the user navigates to it. `HomeView` is eagerly loaded because it's the entry page.

---

## File: `src/main.js`

Register the router with the Vue app:

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

createApp(App).use(router).mount('#app')
```

---

## Route Registry

| Path  | Name       | View Component    | Lazy loaded |
|-------|------------|-------------------|-------------|
| `/`   | `home`     | `HomeView.vue`    | No          |
| `/qr` | `qr-code`  | `QRCodeView.vue`  | Yes         |

---

## Adding a New Route

1. Create the view component in `src/views/`.
2. Add an entry to the `routes` array in `src/router/index.js`:

```js
{
  path: '/your-tool',
  name: 'your-tool',
  component: () => import('../views/YourToolView.vue'),
},
```

3. Add the corresponding card entry in `HomeView.vue` (see [06-adding-new-tools.md](./06-adding-new-tools.md)).

---

## Navigation in Components

Use `<RouterLink>` for declarative navigation (preferred for links and cards):

```vue
<RouterLink to="/qr">Go to QR Tool</RouterLink>
```

Use the `useRouter` composable for programmatic navigation:

```js
import { useRouter } from 'vue-router'
const router = useRouter()
router.push('/qr')
```

---

## Next Step

Proceed to [04-ui-components.md](./04-ui-components.md) to build the app shell and landing page.
