# UI Components

## Overview

The UI is composed of three structural pieces before any tool-specific code is added:

1. **`App.vue`** — the persistent shell (navbar + router outlet)
2. **`HomeView.vue`** — the landing page card grid
3. **`ToolCard.vue`** — the reusable card component

---

## `src/App.vue` — Root Shell

This is the global layout wrapper. It renders on every page. It contains the navbar and the `<RouterView>` slot where page content is injected.

```vue
<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <RouterLink to="/" class="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          Web Tools
        </RouterLink>
      </div>
    </nav>

    <!-- Page content -->
    <main class="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="text-center text-sm text-gray-400 py-4">
      Web Tools by SeeSmitty
    </footer>
  </div>
</template>
```

### Notes
- `min-h-screen flex flex-col` + `flex-1` on `<main>` ensures the footer always sits at the bottom.
- `max-w-5xl mx-auto` constrains content width consistently across all pages.
- The navbar `RouterLink` to `/` takes users back to the tool grid from any tool page.

---

## `src/views/HomeView.vue` — Landing Page

This view holds the **tool registry** — a plain JS array that drives the card grid. Adding a new tool to this array is the only change required in this file.

```vue
<script setup>
import ToolCard from '../components/ToolCard.vue'

const tools = [
  {
    name: 'QR Code Generator',
    description: 'Generate a QR code from any URL or text. Download as PNG.',
    icon: '⬛',
    route: '/qr',
  },
  // Add future tools here. A card will appear automatically.
]
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-2">Tools</h1>
    <p class="text-gray-500 mb-8">Pick a tool to get started.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ToolCard
        v-for="tool in tools"
        :key="tool.route"
        :name="tool.name"
        :description="tool.description"
        :icon="tool.icon"
        :route="tool.route"
      />
    </div>
  </div>
</template>
```

### Tool registry object shape

| Property      | Type   | Description                                      |
|---------------|--------|--------------------------------------------------|
| `name`        | String | Display name shown on the card                   |
| `description` | String | One-line description shown below the name        |
| `icon`        | String | Emoji or Unicode character used as the card icon |
| `route`       | String | Vue Router path — must match an entry in `router/index.js` |

---

## `src/components/ToolCard.vue` — Reusable Card

Receives the tool registry object as props and renders a clickable card that navigates to the tool.

```vue
<script setup>
defineProps({
  name: String,
  description: String,
  icon: String,
  route: String,
})
</script>

<template>
  <RouterLink
    :to="route"
    class="group block bg-white rounded-2xl border border-gray-200 shadow-sm p-6
           hover:shadow-md hover:border-blue-300 transition-all duration-200"
  >
    <div class="text-4xl mb-4">{{ icon }}</div>
    <h2 class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
      {{ name }}
    </h2>
    <p class="text-sm text-gray-500 mt-1">{{ description }}</p>
  </RouterLink>
</template>
```

### Notes
- The entire card is a `RouterLink` — no nested anchor tags.
- `group` + `group-hover:text-blue-600` applies hover color to the title when the card is hovered.
- The card is purely presentational — no internal state, no emits.

---

## `src/views/QRCodeView.vue` — QR Tool Page Wrapper

Each tool view is a thin wrapper that provides a page title and imports the tool component.

```vue
<script setup>
import QRCodeTool from '../components/tools/QRCodeTool.vue'
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">QR Code Generator</h1>
    <QRCodeTool />
  </div>
</template>
```

All tool views follow this same pattern: a heading and the tool component. Logic lives in the tool component, not the view.

---

## Next Step

Proceed to [05-qr-code-tool.md](./05-qr-code-tool.md) to implement the QR Code tool component.
