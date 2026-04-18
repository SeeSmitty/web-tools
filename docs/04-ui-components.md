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
    icon: '🔲',
    route: '/qr',
    color: 'blue',
  },
  // Add future tools here. A card will appear automatically.
]
</script>

<template>
  <div>
    <!-- Hero header -->
    <div class="mb-10">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-3">
        Web <span class="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Tools</span>
      </h1>
      <p class="text-gray-500 text-lg">Simple, fast, browser-based utilities. No signup required.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ToolCard
        v-for="tool in tools"
        :key="tool.route"
        :name="tool.name"
        :description="tool.description"
        :icon="tool.icon"
        :route="tool.route"
        :color="tool.color"
      />
    </div>
  </div>
</template>
```

### Tool registry object shape

| Property      | Type   | Description                                                        |
|---------------|--------|--------------------------------------------------------------------|
| `name`        | String | Display name shown on the card                                     |
| `description` | String | One-line description shown below the name                          |
| `icon`        | String | Emoji used as the card icon (displayed in the gradient banner)     |
| `route`       | String | Vue Router path — must match an entry in `router/index.js`         |
| `color`       | String | Card gradient theme: `blue`, `green`, `purple`, `orange`, `pink`, `teal` |

---

## `src/components/ToolCard.vue` — Reusable Card

Receives the tool registry object as props and renders a clickable card. Each card has a **colored gradient banner** at the top (containing the icon) and a white text section below.

Available `color` values: `blue`, `green`, `purple`, `orange`, `pink`, `teal`.

```vue
<script setup>
defineProps({
  name: String,
  description: String,
  icon: String,
  route: String,
  color: { type: String, default: 'blue' },
})

const gradients = {
  blue:   'from-blue-400 to-indigo-600',
  green:  'from-emerald-400 to-teal-600',
  purple: 'from-purple-400 to-violet-600',
  orange: 'from-orange-400 to-amber-500',
  pink:   'from-pink-400 to-rose-600',
  teal:   'from-teal-400 to-cyan-600',
}
</script>

<template>
  <RouterLink
    :to="route"
    class="group block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
           hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
  >
    <!-- Gradient banner with icon -->
    <div
      :class="`bg-gradient-to-br ${gradients[color] ?? gradients.blue} flex items-center justify-center h-28`"
    >
      <span class="text-5xl drop-shadow-md">{{ icon }}</span>
    </div>

    <!-- Text -->
    <div class="p-5">
      <h2 class="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
        {{ name }}
      </h2>
      <p class="text-sm text-gray-500 mt-1">{{ description }}</p>
    </div>
  </RouterLink>
</template>
```

### Notes
- `overflow-hidden` on the card clips the gradient banner to the rounded corners.
- `hover:-translate-y-1` gives a satisfying lift effect on hover.
- The `gradients` lookup uses full Tailwind class strings so the purger can detect them at build time.

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
